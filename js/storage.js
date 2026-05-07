(function() {
  'use strict';

  var DB_NAME = 'vn-editor-images';
  var DB_VERSION = 1;
  var STORE_NAME = 'images';
  var LS_KEY = 'vn-editor-project';

  var db = null;

  // ========================================
  // IndexedDB — imágenes custom
  // ========================================

  function openDB() {
    return new Promise(function(resolve, reject) {
      if (db) { resolve(db); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          d.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = function(e) { db = e.target.result; resolve(db); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  }

  function saveImage(filename, blob) {
    return openDB().then(function(d) {
      return new Promise(function(resolve, reject) {
        var tx = d.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(blob, filename);
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function getImage(filename) {
    return openDB().then(function(d) {
      return new Promise(function(resolve, reject) {
        var tx = d.transaction(STORE_NAME, 'readonly');
        var req = tx.objectStore(STORE_NAME).get(filename);
        req.onsuccess = function() { resolve(req.result || null); };
        req.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function deleteImage(filename) {
    return openDB().then(function(d) {
      return new Promise(function(resolve, reject) {
        var tx = d.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(filename);
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function getAllImages() {
    return openDB().then(function(d) {
      return new Promise(function(resolve, reject) {
        var tx = d.transaction(STORE_NAME, 'readonly');
        var req = tx.objectStore(STORE_NAME).getAllKeys();
        req.onsuccess = function() { resolve(req.result || []); };
        req.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  function clearAllImages() {
    return openDB().then(function(d) {
      return new Promise(function(resolve, reject) {
        var tx = d.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function(e) { reject(e.target.error); };
      });
    });
  }

  // ========================================
  // localStorage — proyecto
  // ========================================

  function saveProject(data) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      console.log('Proyecto guardado en localStorage');
      // Debug: mostrar primer elemento de la primera escena
      if (data.scenes && data.scenes[0] && data.scenes[0].sequence && data.scenes[0].sequence.length > 0) {
        console.log('Primer elemento de la primer escena:', data.scenes[0].sequence[0]);
      }
    } catch(e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  function loadProject() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (data && data.scenes) {
        console.log('Proyecto cargado desde localStorage:', data.scenes.length, 'escenas');
        // Migrate resources to add missing ones
        data = migrateResources(data);
        // Buscar elementos con disappearAfter
        var totalDisappear = 0;
        data.scenes.forEach(function(scene, idx) {
          if (scene.sequence) {
            scene.sequence.forEach(function(item) {
              if (item.disappearAfter !== undefined || item.showAfter !== undefined) {
                totalDisappear++;
              }
            });
          }
        });
        console.log('Total elementos con disappearAfter/showAfter:', totalDisappear);
        // Save migrated project back to localStorage
        saveProject(data);
      }
      return data;
    } catch(e) {
      console.error('Error loading from localStorage:', e);
      return null;
    }
  }

  function clearProject() {
    localStorage.removeItem(LS_KEY);
  }

  // ========================================
  // Escaneo de imágenes existentes en images/
  // ========================================

  var DEFAULT_IMAGES = [
    'asahi.png','asahi_enojada.png','asahi_enojada_derecha.png','asahi_pensativa.png',
    'camero.png','caminata.png','clase.jpg','clase-vertical.jpg',
    'dormitorio.jpg','fondo-entrada.jpg','fondo-sakura.jpg','fondo-sakura1.jpg',
    'karaoke.png','komori.png','komori_alerta.png','komori_asustada.png','komori_timida.png',
    'logo.png','mango.png','mango-chulo.png','mango_derecha.png',
    'nicorasu.png','nicorasu_contento.png','nicorasu_contento_derecha.png','nicorasu_mugiwara.png',
    'rina.png','rina_derecha.png','sombrero.png'
  ];

  function getDefaultCharacters() {
    return [
      { id: 'komori', name: 'コモリ (Komori)', image: 'komori.png', custom: false },
      { id: 'komori_alerta', name: 'Komori Alerta', image: 'komori_alerta.png', custom: false },
      { id: 'komori_asustada', name: 'Komori Asustada', image: 'komori_asustada.png', custom: false },
      { id: 'komori_timida', name: 'Komori Tímida', image: 'komori_timida.png', custom: false },
      { id: 'asahi', name: 'アサヒ (Asahi)', image: 'asahi.png', custom: false },
      { id: 'asahi_enojada', name: 'Asahi Enojada', image: 'asahi_enojada.png', custom: false },
      { id: 'asahi_enojada_derecha', name: 'Asahi Enojada Derecha', image: 'asahi_enojada_derecha.png', custom: false },
      { id: 'asahi_pensativa', name: 'Asahi Pensativa', image: 'asahi_pensativa.png', custom: false },
      { id: 'mango', name: 'マンゴ (Mango)', image: 'mango.png', custom: false },
      { id: 'mango-chulo', name: 'Mango Chulo', image: 'mango-chulo.png', custom: false },
      { id: 'mango_derecha', name: 'Mango Derecha', image: 'mango_derecha.png', custom: false },
      { id: 'camero', name: 'カメロ (Camero)', image: 'camero.png', custom: false },
      { id: 'nicorasu', name: 'ニコラス (Nicolas)', image: 'nicorasu.png', custom: false },
      { id: 'nicorasu_contento', name: 'Nicorasu Contento', image: 'nicorasu_contento.png', custom: false },
      { id: 'nicorasu_contento_derecha', name: 'Nicorasu Contento Derecha', image: 'nicorasu_contento_derecha.png', custom: false },
      { id: 'nicorasu_mugiwara', name: 'Nicorasu Mugiwara', image: 'nicorasu_mugiwara.png', custom: false },
      { id: 'rina', name: 'リナ (Rina)', image: 'rina.png', custom: false },
      { id: 'rina_derecha', name: 'Rina Derecha', image: 'rina_derecha.png', custom: false }
    ];
  }

  function getDefaultBackgrounds() {
    return [
      { id: 'clase', file: 'clase.jpg', custom: false },
      { id: 'clase-vertical', file: 'clase-vertical.jpg', custom: false },
      { id: 'dormitorio', file: 'dormitorio.jpg', custom: false },
      { id: 'caminata', file: 'caminata.png', custom: false },
      { id: 'karaoke', file: 'karaoke.png', custom: false },
      { id: 'fondo-sakura', file: 'fondo-sakura.jpg', custom: false },
      { id: 'fondo-sakura1', file: 'fondo-sakura1.jpg', custom: false },
      { id: 'fondo-entrada', file: 'fondo-entrada.jpg', custom: false }
    ];
  }

  function getDefaultObjects() {
    return [
      { id: 'sombrero', name: 'Sombrero', file: 'sombrero.png', custom: false },
      { id: 'logo', name: 'Logo', file: 'logo.png', custom: false }
    ];
  }

  // ========================================
  // Exportar proyecto como ZIP
  // ========================================

  function exportProject(projectData) {
    return getAllImages().then(function(customImageNames) {
      var zip = new JSZip();
      var imagesFolder = zip.folder('images');

      // Agregar project.json
      zip.file('project.json', JSON.stringify(projectData, null, 2));

      // Agregar imágenes custom desde IndexedDB
      var promises = customImageNames.map(function(name) {
        return getImage(name).then(function(blob) {
          if (blob) {
            imagesFolder.file(name, blob);
          }
        });
      });

      return Promise.all(promises).then(function() {
        return zip.generateAsync({ type: 'blob' }).then(function(content) {
          var projectName = (projectData.name || 'mi-proyecto').replace(/[^a-zA-Z0-9_-]/g, '-');
          var link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = projectName + '.zip';
          link.click();
          URL.revokeObjectURL(link.href);
        });
      });
    });
  }

  // ========================================
  // Importar proyecto desde ZIP
  // ========================================

  function importProject(file) {
    return new Promise(function(resolve, reject) {
      if (typeof JSZip === 'undefined') {
        reject(new Error('JSZip not loaded'));
        return;
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        JSZip.loadAsync(e.target.result).then(function(zip) {
          var projectFile = zip.file('project.json');
          if (!projectFile) {
            reject(new Error('Invalid project file: project.json not found'));
            return;
          }

          return projectFile.async('text').then(function(text) {
            var projectData = JSON.parse(text);

            // Extraer imágenes del ZIP
            var imagesFolder = zip.folder('images');
            var promises = [];

            if (imagesFolder) {
              imagesFolder.forEach(function(path, file) {
                promises.push(file.async('blob').then(function(blob) {
                  return saveImage(path, blob);
                }));
              });
            }

            return Promise.all(promises).then(function() {
              saveProject(projectData);
              resolve(projectData);
            });
          });
        }).catch(reject);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // ========================================
  // Cargar plantilla como base para nuevo proyecto
  // ========================================

  var templateCache = null;
  var templateReady = false;

  function fetchTemplate() {
    if (templateCache) return Promise.resolve(templateCache);
    return fetch('plantillas/plantilla-1.zip')
      .then(function(resp) { 
        if (!resp.ok) throw new Error('Failed to load template');
        return resp.blob(); 
      })
      .then(function(blob) {
        return JSZip.loadAsync(blob);
      })
      .then(function(zip) {
        var projectFile = zip.file('project.json');
        if (!projectFile) throw new Error('project.json not found in template');
        return projectFile.async('text');
      })
      .then(function(text) {
        templateCache = JSON.parse(text);
        
        // ENSURE ALL DEFAULT RESOURCES ARE IN TEMPLATE CACHE
        var defaultChars = getDefaultCharacters();
        var defaultBgs = getDefaultBackgrounds();
        var defaultObjs = getDefaultObjects();
        
        if (!templateCache.resources) templateCache.resources = {};
        if (!templateCache.resources.characters) templateCache.resources.characters = [];
        if (!templateCache.resources.backgrounds) templateCache.resources.backgrounds = [];
        if (!templateCache.resources.objects) templateCache.resources.objects = [];
        
        // Add missing characters
        defaultChars.forEach(function(defChar) {
          if (!templateCache.resources.characters.find(function(c) { return c.id === defChar.id; })) {
            templateCache.resources.characters.push({ id: defChar.id, name: defChar.name, image: defChar.image, custom: false });
          }
        });
        
        // Add missing backgrounds
        defaultBgs.forEach(function(defBg) {
          if (!templateCache.resources.backgrounds.find(function(b) { return b.id === defBg.id; })) {
            templateCache.resources.backgrounds.push({ id: defBg.id, file: defBg.file, custom: false });
          }
        });
        
        // Add missing objects
        defaultObjs.forEach(function(defObj) {
          if (!templateCache.resources.objects.find(function(o) { return o.id === defObj.id; })) {
            templateCache.resources.objects.push({ id: defObj.id, name: defObj.name, file: defObj.file, custom: false });
          }
        });
        
        templateReady = true;
        console.log('Plantilla cargada con', templateCache.resources.characters.length, 'personajes,', templateCache.resources.backgrounds.length, 'fondos,', templateCache.resources.objects.length, 'objetos');
        return templateCache;
      })
      .catch(function(err) {
        console.error('Error loading template:', err);
        return null;
      });
  }

  function loadTemplateSync() {
    if (!templateCache || !templateReady) {
      console.warn('Template not loaded yet, using fallback');
      return {
        name: 'Nuevo Proyecto',
        version: 1,
        resources: getDefaultResources(),
        scenes: [{ id: 'scene_1', name: 'Escena 1', background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' }, sequence: [] }]
      };
    }
    var project = JSON.parse(JSON.stringify(templateCache));
    project.name = 'Nuevo Proyecto';
    project.isDemo = false;
    project.version = 1;
    
    // ENSURE ALL DEFAULT RESOURCES ARE AVAILABLE (merge with template resources)
    var defaultChars = getDefaultCharacters();
    var defaultBgs = getDefaultBackgrounds();
    var defaultObjs = getDefaultObjects();
    
    // Ensure characters
    if (!project.resources.characters) project.resources.characters = [];
    defaultChars.forEach(function(defChar) {
      if (!project.resources.characters.find(function(c) { return c.id === defChar.id; })) {
        project.resources.characters.push({ id: defChar.id, name: defChar.name, image: defChar.image, custom: false });
        console.log('Added missing character:', defChar.id);
      }
    });
    
    // Ensure backgrounds
    if (!project.resources.backgrounds) project.resources.backgrounds = [];
    defaultBgs.forEach(function(defBg) {
      if (!project.resources.backgrounds.find(function(b) { return b.id === defBg.id; })) {
        project.resources.backgrounds.push({ id: defBg.id, file: defBg.file, custom: false });
        console.log('Added missing background:', defBg.id);
      }
    });
    
    // Ensure objects
    if (!project.resources.objects) project.resources.objects = [];
    defaultObjs.forEach(function(defObj) {
      if (!project.resources.objects.find(function(o) { return o.id === defObj.id; })) {
        project.resources.objects.push({ id: defObj.id, name: defObj.name, file: defObj.file, custom: false });
        console.log('Added missing object:', defObj.id);
      }
    });
    
    // Remove internal properties
    project.resources.characters.forEach(function(c) { delete c._idx; delete c.custom; });
    project.resources.backgrounds.forEach(function(b) { delete b._idx; delete b.custom; });
    project.resources.objects.forEach(function(o) { delete o._idx; delete o.custom; });
    
    console.log('Template loaded with', project.resources.characters.length, 'characters,', project.resources.backgrounds.length, 'backgrounds,', project.resources.objects.length, 'objects');
    return project;
  }

  function getDefaultResources() {
    return {
      characters: getDefaultCharacters().map(function(c) { return { id: c.id, name: c.name, image: c.image }; }),
      backgrounds: getDefaultBackgrounds().map(function(b) { return { id: b.id, file: b.file }; }),
      objects: getDefaultObjects().map(function(o) { return { id: o.id, name: o.name, file: o.file }; })
    };
  }

  function migrateResources(project) {
    if (!project || !project.resources) return project;
    
    var defaultChars = getDefaultCharacters();
    var defaultBgs = getDefaultBackgrounds();
    var defaultObjs = getDefaultObjects();
    
    // Migrate characters
    defaultChars.forEach(function(defChar) {
      if (!project.resources.characters.find(function(c) { return c.id === defChar.id; })) {
        project.resources.characters.push({ id: defChar.id, name: defChar.name, image: defChar.image, custom: false });
        console.log('Added character:', defChar.id);
      }
    });
    
    // Migrate backgrounds
    defaultBgs.forEach(function(defBg) {
      if (!project.resources.backgrounds.find(function(b) { return b.id === defBg.id; })) {
        project.resources.backgrounds.push({ id: defBg.id, file: defBg.file, custom: false });
        console.log('Added background:', defBg.id);
      }
    });
    
    // Migrate objects
    defaultObjs.forEach(function(defObj) {
      if (!project.resources.objects.find(function(o) { return o.id === defObj.id; })) {
        project.resources.objects.push({ id: defObj.id, name: defObj.name, file: defObj.file, custom: false });
        console.log('Added object:', defObj.id);
      }
    });
    
    return project;
  }

  function resetToTemplateSync() {
    if (!templateCache || !templateReady) {
      console.warn('Template not loaded yet, using fallback demo');
      var project = {
        name: 'Demo Project',
        version: 1,
        isDemo: true,
        resources: getDefaultResources(),
        scenes: [
          { id: 'welcome', name: 'Portada', background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' }, sequence: [] },
          { id: 'scene_1', name: 'Escena 1', background: { type: 'full', file: 'clase.jpg' }, sequence: [] }
        ]
      };
      return project;
    }
    var project = JSON.parse(JSON.stringify(templateCache));
    project.name = 'Demo Project';
    project.isDemo = true;
    project.version = 1;
    project.resources.characters.forEach(function(c) { delete c._idx; delete c.custom; });
    project.resources.backgrounds.forEach(function(b) { delete b._idx; delete b.custom; });
    project.resources.objects.forEach(function(o) { delete o._idx; delete o.custom; });
    return project;
  }

  function loadTemplate(templateJson) {
    var project = JSON.parse(JSON.stringify(templateJson));
    project.name = 'Nuevo Proyecto';
    project.isDemo = false;
    project.version = 1;
    
    project.resources.characters.forEach(function(c) { delete c._idx; delete c.custom; });
    project.resources.backgrounds.forEach(function(b) { delete b._idx; delete b.custom; });
    project.resources.objects.forEach(function(o) { delete o._idx; delete o.custom; });
    
    project.scenes.forEach(function(s) { 
      s.sequence = []; 
    });
    
    clearProject();
    clearAllImages().then(function() {
      saveProject(project);
    }).catch(function() {
      saveProject(project);
    });
    
    return project;
  }

  // Crear proyecto nuevo (usando plantilla o recursos por defecto)
  // ========================================
  
  function createNewProject(name) {
    // Always use default resources to ensure ALL images are available
    var project = {
      name: name || 'Nuevo Proyecto',
      version: 1,
      resources: getDefaultResources(),
      scenes: [
        { id: 'scene_1', name: 'Escena 1', background: { type: 'full', color: 'linear-gradient(180deg, #652381, #3d1450, #1a1a2e)' }, sequence: [] }
      ]
    };
    
    clearProject();
    saveProject(project);
    console.log('Nuevo proyecto creado con', project.resources.characters.length, 'personajes,', project.resources.backgrounds.length, 'fondos,', project.resources.objects.length, 'objetos');
    return project;
  }

  // ========================================
  // Convertir config.js a formato de proyecto
  // ========================================

  function configToProject() {
    if (typeof storyContent === 'undefined') return null;

    var project = {
      name: 'Demo Project',
      version: 1,
      isDemo: true,
      resources: getDefaultResources(),
      scenes: storyContent.map(function(scene) {
        return {
          id: scene.id,
          name: scene.id === 'welcome' ? 'Portada' : scene.id === 'closing' ? 'Cierre' : scene.id.replace('esc_', 'Escena '),
          background: scene.background,
          sequence: (scene.sequence || scene.elements || []).map(function(el) {
            var result = { type: el.type };
            if (el.id) result.id = el.id;
            if (el.file) result.file = el.file;
            if (el.text) result.text = el.text;
            if (el.target) result.target = el.target;
            if (el.hidden) result.hidden = true;
            if (el.tremble) result.tremble = true;
            if (el.position) {
              result.positionType = el.position;
            }
            if (el.silhouette) result.silhouette = true;
            return result;
          })
        };
      })
    };
    return project;
  }

  // ========================================
  // Convertir posición tipo CSS a porcentajes
  // ========================================

  var positionPresets = {
    'left':       { left: '2%', top: '35%', width: '30%', height: '65%' },
    'right':      { left: '68%', top: '35%', width: '30%', height: '65%' },
    'center':     { left: '35%', top: '20%', width: '30%', height: '70%' },
    'bl':         { left: '2%', top: '50%', width: '30%', height: '50%' },
    'br':         { left: '68%', top: '50%', width: '30%', height: '50%' },
    'tl':         { left: '2%', top: '2%', width: '30%', height: '50%' },
    'tr':         { left: '68%', top: '2%', width: '30%', height: '50%' },
    'top-left':   { left: '2%', top: '2%', width: '30%', height: '50%' },
    'top-right':  { left: '68%', top: '2%', width: '30%', height: '50%' },
    'bottom-left':{ left: '2%', top: '50%', width: '30%', height: '50%' },
    'bottom-right':{ left: '68%', top: '50%', width: '30%', height: '50%' },
    'center-left': { left: '10%', top: '38%', width: '36%', height: '45%' },
    'center-left-left': { left: '10%', top: '25%', width: '28%', height: '56%' },
    'center-right': { left: '50%', top: '45%', width: '40%', height: '55%' },
    'center-right-right': { left: '68%', top: '42%', width: '30%', height: '60%' },
    'camuflada':  { left: '10%', top: '60%', width: '30%', height: '10%' }
  };

  var bubblePositionPresets = {
    'left':       { left: '6%', top: '8%' },
    'right':      { left: '52%', top: '8%' },
    'center':     { left: '30%', top: '5%' },
    'tl':         { left: '20%', top: '5%' },
    'tr':         { left: '60%', top: '5%' },
    'bl':         { left: '20%', bottom: '15%' },
    'br':         { left: '60%', bottom: '15%' },
    'top-left':   { left: '17%', top: '6%' },
    'top-right':  { left: '63%', top: '6%' },
    'bottom-left':{ left: '20%', bottom: '6%' },
    'bottom-right':{ left: '60%', bottom: '6%' },
    'tl-l':       { left: '15%', top: '10%' },
    'tl-n':       { left: '20%', top: '1%' },
    'bl-l':       { left: '15%', bottom: '40%' },
    'rina':       { left: '30%', top: '10%' },
    'center-right': { left: '60%', top: '10%' },
    'center-medio': { left: '30%', top: '10%' },
    'narration':  { left: '22.5%', top: '25%' }
  };

  function resolvePosition(preset, type) {
    var presets = type === 'bubble' ? bubblePositionPresets : positionPresets;
    return presets[preset] || { left: '35%', top: '30%' };
  }

  // ========================================
  // Convertir proyecto a formato engine.js
  // ========================================

  function projectToEngine(project) {
    if (!project) return null;

    return project.scenes.map(function(scene) {
      return {
        id: scene.id,
        isWelcome: scene.id === 'welcome',
        background: scene.background,
        sequence: scene.sequence.map(function(el) {
          var item = { type: el.type };
          if (el.id) item.id = el.id;
          if (el.file) item.file = el.file;
          if (el.text) item.text = el.text;
          if (el.target) item.target = el.target;
          if (el.hidden !== undefined) item.hidden = el.hidden;
          if (el.tremble) item.tremble = true;
          if (el.silhouette) item.silhouette = true;
          if (el.showAfter !== undefined) item.showAfter = el.showAfter;
          if (el.disappearAfter !== undefined) item.disappearAfter = el.disappearAfter;
          if (el.tailPosition) item.tailPosition = el.tailPosition;

          // Posición custom o preset
          if (el.position) {
            item.position = el.position;
          } else if (el.positionType) {
            item.position = el.positionType;
          }

          return item;
        })
      };
    });
  }

  // ========================================
  // Exponer API global
  // ========================================

  window.VNStorage = {
    saveImage: saveImage,
    getImage: getImage,
    deleteImage: deleteImage,
    getAllImages: getAllImages,
    clearAllImages: clearAllImages,
    saveProject: saveProject,
    loadProject: loadProject,
    clearProject: clearProject,
    exportProject: exportProject,
    importProject: importProject,
    createNewProject: createNewProject,
    loadTemplate: loadTemplate,
    loadTemplateSync: loadTemplateSync,
    resetToTemplateSync: resetToTemplateSync,
    fetchTemplate: fetchTemplate,
    configToProject: configToProject,
    projectToEngine: projectToEngine,
    resolvePosition: resolvePosition,
    getDefaultCharacters: getDefaultCharacters,
    getDefaultBackgrounds: getDefaultBackgrounds,
    getDefaultObjects: getDefaultObjects
  };

})();
