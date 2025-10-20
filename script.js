document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
  const logList = document.getElementById('logList');
  const waterFill = document.getElementById('waterLevel');
  const nutrientFill = document.getElementById('nutrientLevel');
  const healthFill = document.getElementById('healthLevel');
  const growthFill = document.getElementById('growthLevel');
  const waterLabel = document.getElementById('waterLabel');
  const nutrientLabel = document.getElementById('nutrientLabel');
  const healthLabel = document.getElementById('healthLabel');
  const growthLabel = document.getElementById('growthLabel');
  const actionButtons = document.querySelectorAll('.action');
  const plantScene = document.getElementById('plantScene');
  const plantVisual = document.getElementById('plantVisual');
  const plantMouth = document.getElementById('plantMouth');

  const plant = {
    water: 70,
    nutrients: 60,
    health: 100,
    growth: 0,
    pests: false,
    mood: 0,
    stage: 'Keimling',
    alive: true
  };

  const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

  function addLogEntry(message) {
    const entry = document.createElement('li');
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    entry.textContent = `${time} – ${message}`;
    logList.prepend(entry);
    while (logList.children.length > 10) {
      logList.removeChild(logList.lastChild);
    }
  }

  function updateBar(fillEl, labelEl, value) {
    fillEl.style.width = `${value}%`;
    labelEl.textContent = `${Math.round(value)} / 100`;
    fillEl.parentElement.setAttribute('aria-valuenow', Math.round(value));
  }

  function describeStage() {
    if (plant.growth < 25) return 'Keimling';
    if (plant.growth < 50) return 'Jungpflanze';
    if (plant.growth < 80) return 'kräftige Pflanze';
    if (plant.growth < 100) return 'fast ausgewachsen';
    return 'prächtige Zimmerpflanze';
  }

  function statusMessage() {
    if (!plant.alive) {
      return 'Oh nein! Die Pflanze ist vertrocknet. Lade neu, um noch einmal zu starten.';
    }

    if (plant.health < 30) {
      return 'Die Pflanze kämpft. Du solltest dich dringend kümmern!';
    }

    const needs = [];
    if (plant.water < 40) needs.push('Wasser');
    if (plant.nutrients < 35) needs.push('Nährstoffe');
    if (plant.pests) needs.push('Schädlingskontrolle');

    if (needs.length > 0) {
      return `Die Pflanze braucht Aufmerksamkeit: ${needs.join(', ')}.`;
    }

    if (plant.growth >= 100) {
      return 'Bravo! Deine Pflanze ist zur prächtigen Zimmerpflanze herangewachsen.';
    }

    return 'Alles im grünen Bereich. Die Pflanze fühlt sich wohl.';
  }

  function updateUI() {
    updateBar(waterFill, waterLabel, plant.water);
    updateBar(nutrientFill, nutrientLabel, plant.nutrients);
    updateBar(healthFill, healthLabel, plant.health);
    updateBar(growthFill, growthLabel, plant.growth);
    plant.stage = describeStage();
    statusEl.textContent = statusMessage();
    updatePlantVisual();
  }

  function updatePlantVisual() {
    if (!plantScene || !plantVisual || !plantMouth) return;

    const growthRatio = plant.growth / 100;
    const waterRatio = plant.water / 100;
    const healthRatio = plant.health / 100;

    const stemHeight = 110 + growthRatio * 150;
    const droop = 26 - waterRatio * 24;
    const midDroop = droop * 0.45;
    const hue = 90 + healthRatio * 45;
    const lightness = 30 + waterRatio * 16;
    const stemLightness = Math.min(lightness + 6, 60);
    const budScale = Math.max(0, Math.min(1, (growthRatio - 0.4) / 0.5));
    const glowOpacity = 0.18 + Math.max(0, (healthRatio + growthRatio) / 2) * 0.4;
    const glowScale = 0.9 + growthRatio * 0.45;
    const leafHighlight = Math.min(lightness + 18, 78);
    const leafShadow = Math.max(lightness - 18, 20);
    const stemHighlight = Math.min(stemLightness + 10, 70);
    const blossom = Math.min(1, Math.max(0, (growthRatio - 0.3) / 0.6));
    const petalScale = 0.25 + blossom * 0.75;
    const flowerHue = hue + 56;
    const flowerLightness = 66 + blossom * 18;
    const flowerShadowLightness = Math.max(flowerLightness - 18, 30);
    const petalOpacity = Math.min(1, 0.2 + petalScale * 0.8);
    const budOpacity = Math.min(1, 0.25 + budScale * 0.75);
    const cheer = Math.min(1, (plant.health + plant.water) / 200);
    const cheekOpacity = 0.3 + cheer * 0.45;
    const lean = (plant.water - 50) / 14;

    plantVisual.style.setProperty('--stem-height', `${stemHeight}px`);
    plantVisual.style.setProperty('--leaf-droop', `${droop}deg`);
    plantVisual.style.setProperty('--leaf-droop-mid', `${midDroop.toFixed(2)}deg`);
    plantVisual.style.setProperty('--leaf-color', `hsl(${hue}, 58%, ${lightness}%)`);
    plantVisual.style.setProperty('--stem-color', `hsl(${hue - 12}, 52%, ${stemLightness}%)`);
    plantVisual.style.setProperty('--bud-scale', budScale.toFixed(2));
    plantVisual.style.setProperty('--leaf-highlight', `hsl(${hue}, 65%, ${leafHighlight}%)`);
    plantVisual.style.setProperty('--leaf-shadow', `hsl(${hue - 16}, 52%, ${leafShadow}%)`);
    plantVisual.style.setProperty('--stem-highlight', `hsl(${hue - 10}, 55%, ${stemHighlight}%)`);
    plantVisual.style.setProperty('--flower-color', `hsl(${flowerHue}, 75%, ${flowerLightness}%)`);
    plantVisual.style.setProperty('--flower-shadow', `hsl(${flowerHue - 18}, 72%, ${flowerShadowLightness}%)`);
    plantVisual.style.setProperty('--petal-scale', petalScale.toFixed(2));
    plantVisual.style.setProperty('--petal-opacity', petalOpacity.toFixed(2));
    plantVisual.style.setProperty('--bud-opacity', budOpacity.toFixed(2));
    plantVisual.style.setProperty('--cheek-opacity', cheekOpacity.toFixed(2));
    plantVisual.style.setProperty('--plant-tilt', `${lean.toFixed(2)}deg`);
    plantVisual.style.setProperty('--face-tilt', `${(-lean / 1.8).toFixed(2)}deg`);
    plantScene.style.setProperty('--glow-opacity', glowOpacity.toFixed(2));
    plantScene.style.setProperty('--glow-scale', glowScale.toFixed(2));

    plantVisual.classList.remove('plant-visual__plant--happy', 'plant-visual__plant--sad', 'plant-visual__plant--alert');
    plantMouth.classList.remove('plant-visual__mouth--neutral', 'plant-visual__mouth--sad');

    if (!plant.alive || plant.health < 25 || plant.water < 25) {
      plantVisual.classList.add('plant-visual__plant--sad');
      plantMouth.classList.add('plant-visual__mouth--sad');
    } else if (plant.health > 72 && plant.water > 45 && plant.water < 85 && !plant.pests) {
      plantVisual.classList.add('plant-visual__plant--happy');
    } else {
      plantVisual.classList.add('plant-visual__plant--alert');
      plantMouth.classList.add('plant-visual__mouth--neutral');
    }
  }

  function triggerRandomEvents() {
    if (!plant.pests && Math.random() < 0.08) {
      plant.pests = true;
      addLogEntry('🪲 Kleine Schädlinge naschen an den Blättern! Besprühe die Pflanze.');
    }

    if (plant.pests && Math.random() < 0.1) {
      plant.health = clamp(plant.health - 6);
      addLogEntry('🪲 Die Schädlinge schwächen die Pflanze.');
    }
  }

  function tick() {
    if (!plant.alive) return;

    plant.water = clamp(plant.water - (2 + Math.random() * 2));
    plant.nutrients = clamp(plant.nutrients - (1 + Math.random() * 1.2));

    if (plant.water < 30) {
      plant.health = clamp(plant.health - 4);
      addLogEntry('⚠️ Deine Pflanze seufzt nach Wasser.');
    } else if (plant.water > 90) {
      plant.health = clamp(plant.health - 3);
      addLogEntry('⚠️ Zu viel Wasser staut sich im Topf.');
    } else {
      plant.health = clamp(plant.health + 1, 0, 100);
    }

    if (plant.nutrients < 25) {
      plant.health = clamp(plant.health - 4);
    } else if (plant.nutrients > 80) {
      plant.health = clamp(plant.health - 2);
    } else {
      plant.health = clamp(plant.health + 1, 0, 100);
    }

    if (plant.health <= 0) {
      plant.alive = false;
      plant.health = 0;
      addLogEntry('🥀 Die Pflanze ist eingegangen. Vielleicht klappt es beim nächsten Mal besser.');
    }

    if (plant.health > 40 && plant.water > 40 && plant.water < 80 && plant.nutrients > 35 && !plant.pests) {
      const growthBoost = 2 + Math.random() * 3;
      plant.growth = clamp(plant.growth + growthBoost);
      if (plant.growth >= 100) {
        plant.growth = 100;
        addLogEntry('🌼 Deine Pflanze blüht in voller Pracht!');
      } else if (Math.random() < 0.4) {
        addLogEntry(`🌿 Die Pflanze wächst weiter (${Math.round(plant.growth)}%).`);
      }
    } else {
      plant.growth = clamp(plant.growth - 0.25, 0, 100);
    }

    triggerRandomEvents();
    updateUI();
  }

  function performAction(action) {
    if (!plant.alive) {
      addLogEntry('🥀 Die Pflanze reagiert nicht mehr. Starte neu, um weiterzuspielen.');
      return;
    }

    switch (action) {
      case 'water': {
        plant.water = clamp(plant.water + 25);
        addLogEntry('🚿 Du gießt die Pflanze. Die Erde saugt sich voll.');
        break;
      }
      case 'fertilize': {
        plant.nutrients = clamp(plant.nutrients + 22);
        addLogEntry('🧪 Du gibst einen ausgewogenen Dünger dazu.');
        break;
      }
      case 'sun': {
        if (plant.water < 35) {
          addLogEntry('☀️ Die Sonne tut gut, aber ohne Wasser wird es kritisch.');
          plant.health = clamp(plant.health - 4);
        } else {
          plant.growth = clamp(plant.growth + 6);
          addLogEntry('☀️ Die Pflanze genießt das Sonnenbad und streckt sich.');
        }
        break;
      }
      case 'prune': {
        plant.health = clamp(plant.health + 12);
        plant.growth = clamp(plant.growth - 2, 0, 100);
        addLogEntry('✂️ Du schneidest alte Blätter weg. Platz für Neues!');
        break;
      }
      case 'mist': {
        if (plant.pests) {
          plant.pests = false;
          addLogEntry('💦 Du besprühst die Pflanze und vertreibst die Schädlinge.');
          plant.health = clamp(plant.health + 8);
        } else {
          plant.water = clamp(plant.water + 8);
          addLogEntry('💦 Ein leichter Sprühnebel sorgt für frische Luft.');
        }
        break;
      }
      case 'inspect': {
        addLogEntry(`🔎 Die Pflanze ist ${plant.stage} und fühlt sich ${plant.health > 70 ? 'pudelwohl' : 'etwas schwach'}.`);
        break;
      }
      default:
        break;
    }

    updateUI();
  }

  actionButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const { action } = event.currentTarget.dataset;
      performAction(action);
    });
  });

  updateUI();
  addLogEntry('👩‍🌾 Du bist bereit, dich um die Pflanze zu kümmern.');

  const gameInterval = window.setInterval(tick, 5000);

  window.addEventListener('beforeunload', () => {
    window.clearInterval(gameInterval);
  });
});
