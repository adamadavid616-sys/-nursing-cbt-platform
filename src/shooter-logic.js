const ARENA_PADDING = 0.2;

export const DEFAULT_CONFIG = {
  width: 18,
  height: 18,
  maxHealth: 5,
  playerSpeed: 7.2,
  bulletSpeed: 14,
  fireCooldown: 0.17,
  enemySpawnInterval: 1.1,
  enemySpeed: 1.45,
  invulnerabilityDuration: 0.9,
};

export function createInitialState(config = DEFAULT_CONFIG) {
  return {
    width: config.width,
    height: config.height,
    config,
    player: {
      x: config.width / 2,
      y: config.height / 2,
      aimX: 1,
      aimY: 0,
      health: config.maxHealth,
      invulnerability: 0,
    },
    bullets: [],
    enemies: [],
    impacts: [],
    score: 0,
    wave: 1,
    elapsed: 0,
    spawnTimer: 0.5,
    fireTimer: 0,
    isPaused: false,
    isGameOver: false,
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function updateGame(state, input, deltaSeconds, random = Math.random) {
  if (state.isPaused || state.isGameOver) {
    return {
      ...state,
      player: updateAim(state.player, input.aim),
    };
  }

  const nextElapsed = state.elapsed + deltaSeconds;
  const nextWave = 1 + Math.floor(nextElapsed / 15);
  const movedPlayer = movePlayer(state, input, deltaSeconds);
  const aimedPlayer = updateAim(movedPlayer, input.aim);
  const fireTimer = Math.max(0, state.fireTimer - deltaSeconds);
  const invulnerability = Math.max(0, aimedPlayer.invulnerability - deltaSeconds);
  let nextState = {
    ...state,
    elapsed: nextElapsed,
    wave: nextWave,
    player: {
      ...aimedPlayer,
      invulnerability,
    },
    fireTimer,
  };

  nextState = spawnEnemyIfNeeded(nextState, deltaSeconds, random);
  nextState = maybeFireBullet(nextState, input);
  nextState = moveProjectiles(nextState, deltaSeconds);
  nextState = moveEnemies(nextState, deltaSeconds);
  nextState = resolveCombat(nextState);
  nextState = expireImpacts(nextState, deltaSeconds);

  return nextState;
}

function movePlayer(state, input, deltaSeconds) {
  const magnitude = Math.hypot(input.moveX, input.moveY) || 1;
  const velocityX = (input.moveX / magnitude) * state.config.playerSpeed;
  const velocityY = (input.moveY / magnitude) * state.config.playerSpeed;

  return {
    ...state.player,
    x: clamp(state.player.x + velocityX * deltaSeconds, ARENA_PADDING, state.width - ARENA_PADDING),
    y: clamp(state.player.y + velocityY * deltaSeconds, ARENA_PADDING, state.height - ARENA_PADDING),
  };
}

function updateAim(player, aim) {
  if (!aim) {
    return player;
  }

  const normalized = normalizeVector(aim.x - player.x, aim.y - player.y);
  if (!normalized) {
    return player;
  }

  return {
    ...player,
    aimX: normalized.x,
    aimY: normalized.y,
  };
}

function spawnEnemyIfNeeded(state, deltaSeconds, random) {
  const nextTimer = state.spawnTimer - deltaSeconds;
  if (nextTimer > 0) {
    return {
      ...state,
      spawnTimer: nextTimer,
    };
  }

  const enemy = createEnemy(state, random);
  const intervalFloor = Math.max(0.32, state.config.enemySpawnInterval - state.wave * 0.06);

  return {
    ...state,
    enemies: [...state.enemies, enemy],
    spawnTimer: intervalFloor + random() * 0.4,
  };
}

function maybeFireBullet(state, input) {
  if (!input.isFiring || state.fireTimer > 0) {
    return state;
  }

  const aim = normalizeVector(state.player.aimX, state.player.aimY);
  if (!aim) {
    return state;
  }

  const muzzleOffset = 0.7;
  const bullet = {
    id: `b-${state.elapsed}-${state.bullets.length}`,
    x: state.player.x + aim.x * muzzleOffset,
    y: state.player.y + aim.y * muzzleOffset,
    vx: aim.x * state.config.bulletSpeed,
    vy: aim.y * state.config.bulletSpeed,
    ttl: 1.3,
  };

  return {
    ...state,
    bullets: [...state.bullets, bullet],
    fireTimer: state.config.fireCooldown,
  };
}

function moveProjectiles(state, deltaSeconds) {
  const bullets = state.bullets
    .map((bullet) => ({
      ...bullet,
      x: bullet.x + bullet.vx * deltaSeconds,
      y: bullet.y + bullet.vy * deltaSeconds,
      ttl: bullet.ttl - deltaSeconds,
    }))
    .filter(
      (bullet) =>
        bullet.ttl > 0 &&
        bullet.x >= -1 &&
        bullet.x <= state.width + 1 &&
        bullet.y >= -1 &&
        bullet.y <= state.height + 1,
    );

  return {
    ...state,
    bullets,
  };
}

function moveEnemies(state, deltaSeconds) {
  const speedBoost = 1 + (state.wave - 1) * 0.08;
  const enemies = state.enemies.map((enemy) => {
    const direction = normalizeVector(state.player.x - enemy.x, state.player.y - enemy.y);
    if (!direction) {
      return enemy;
    }

    return {
      ...enemy,
      x: enemy.x + direction.x * enemy.speed * speedBoost * deltaSeconds,
      y: enemy.y + direction.y * enemy.speed * speedBoost * deltaSeconds,
    };
  });

  return {
    ...state,
    enemies,
  };
}

function resolveCombat(state) {
  const survivingBullets = [];
  const survivingEnemies = [...state.enemies];
  const impacts = [...state.impacts];
  let score = state.score;

  for (const bullet of state.bullets) {
    const hitIndex = survivingEnemies.findIndex(
      (enemy) => distanceBetween(enemy, bullet) < enemy.radius + 0.35,
    );

    if (hitIndex === -1) {
      survivingBullets.push(bullet);
      continue;
    }

    const [enemy] = survivingEnemies.splice(hitIndex, 1);
    impacts.push(createImpact(enemy.x, enemy.y, "impact"));
    score += 10;
  }

  let player = state.player;
  let isGameOver = state.isGameOver;
  const finalEnemies = [];

  for (const enemy of survivingEnemies) {
    if (distanceBetween(enemy, player) >= enemy.radius + 0.45) {
      finalEnemies.push(enemy);
      continue;
    }

    impacts.push(createImpact(enemy.x, enemy.y, "impact"));

    if (player.invulnerability > 0) {
      continue;
    }

    const nextHealth = player.health - 1;
    player = {
      ...player,
      health: nextHealth,
      invulnerability: state.config.invulnerabilityDuration,
    };
    isGameOver = nextHealth <= 0;
  }

  return {
    ...state,
    bullets: survivingBullets,
    enemies: finalEnemies,
    impacts,
    player,
    score,
    isGameOver,
  };
}

function expireImpacts(state, deltaSeconds) {
  return {
    ...state,
    impacts: state.impacts
      .map((impact) => ({
        ...impact,
        ttl: impact.ttl - deltaSeconds,
      }))
      .filter((impact) => impact.ttl > 0),
  };
}

function createEnemy(state, random) {
  const side = Math.floor(random() * 4);
  const margin = 0.7;
  const enemy = {
    id: `e-${state.elapsed}-${state.enemies.length}`,
    radius: 0.52,
    speed: state.config.enemySpeed + random() * 0.5,
    x: 0,
    y: 0,
  };

  if (side === 0) {
    enemy.x = random() * state.width;
    enemy.y = -margin;
  } else if (side === 1) {
    enemy.x = state.width + margin;
    enemy.y = random() * state.height;
  } else if (side === 2) {
    enemy.x = random() * state.width;
    enemy.y = state.height + margin;
  } else {
    enemy.x = -margin;
    enemy.y = random() * state.height;
  }

  return enemy;
}

function createImpact(x, y, variant) {
  return {
    id: `i-${x}-${y}-${Math.random()}`,
    x,
    y,
    variant,
    ttl: 0.16,
  };
}

function normalizeVector(x, y) {
  const length = Math.hypot(x, y);
  if (!length) {
    return null;
  }

  return {
    x: x / length,
    y: y / length,
  };
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
