// Enhanced Flower Keyboard App JavaScript with Layered System

class FlowerKeyboardApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvasItems = [];
        this.selectedItem = null;
        this.dragData = null;
        this.resizeData = null;
        this.nextId = 1;
        this.currentBackground = '#FFFFFF';
        this.isDragging = false;
        this.isResizing = false;
        this.currentCanvasSize = 'laptop';
        this.undoStack = [];
        this.longPressTimer = null;
        this.selectedContainerDesign = null;
        this.selectedContainerColor = null;
        this.selectedRibbonDesign = null;
        this.selectedRibbonColor = null;
        this.dragThreshold = 5; // Minimum pixels to move before starting drag
        this.startPos = null;
        
        // App data from provided JSON
        this.canvasSizes = {
            "mobile": {"width": 320, "height": 568, "name": "Mobile (320×568)"},
            "ipad": {"width": 768, "height": 1024, "name": "iPad (768×1024)"},
            "laptop": {"width": 1024, "height": 768, "name": "Laptop (1024×768)"}
        };
        
        this.expandedFlowerMapping = {
            "A": "🌸", "B": "🌺", "C": "🌻", "D": "🌷", "E": "🌹", "F": "🌼", "G": "🌿", "H": "🍀", "I": "🌱", "J": "🌾", "K": "🌳", "L": "🌲", "M": "🌴", "N": "🌵", "O": "🌶️", "P": "🌽", "Q": "🍄", "R": "🌰", "S": "🍃", "T": "🌙", "U": "⭐", "V": "☀️", "W": "🌞", "X": "🌈", "Y": "🌊", "Z": "❄️",
            "0": "🦋", "1": "🐝", "2": "🐞", "3": "🐛", "4": "🐜", "5": "🕷️", "6": "🐌", "7": "🐢", "8": "🦗", "9": "🐠"
        };
        
        this.containerDesigns = [
            {"name": "Vase", "emoji": "🏺", "description": "Ceramic vase container"},
            {"name": "Basket", "emoji": "🧺", "description": "Woven basket container"},
            {"name": "Pot", "emoji": "🪴", "description": "Empty flower pot"},
            {"name": "Bowl", "emoji": "🥣", "description": "Decorative bowl"},
            {"name": "Trophy", "emoji": "🏆", "description": "Trophy-style container"}
        ];
        
        this.ribbonDesigns = [
            {"name": "Classic Bow", "emoji": "🎀", "description": "Traditional bow shape"},
            {"name": "Banner", "emoji": "📜", "description": "Horizontal banner ribbon"},
            {"name": "Curved", "emoji": "🎗️", "description": "Awareness ribbon style"},
            {"name": "Heart", "emoji": "💕", "description": "Heart-shaped ribbon"},
            {"name": "Star", "emoji": "⭐", "description": "Star-shaped accent"},
            {"name": "Diamond", "emoji": "💎", "description": "Diamond decorative element"}
        ];
        
        this.containerColors = [
            {"name": "Red", "value": "#FF0000"},
            {"name": "Blue", "value": "#0000FF"},
            {"name": "Green", "value": "#008000"},
            {"name": "Yellow", "value": "#FFFF00"},
            {"name": "Pink", "value": "#FF69B4"},
            {"name": "Purple", "value": "#800080"},
            {"name": "Brown", "value": "#8B4513"},
            {"name": "White", "value": "#FFFFFF"},
            {"name": "Black", "value": "#000000"}
        ];
        
        this.ribbonColors = [
            {"name": "Red", "value": "#FF0000"},
            {"name": "Blue", "value": "#0000FF"},
            {"name": "Pink", "value": "#FF69B4"},
            {"name": "Yellow", "value": "#FFFF00"},
            {"name": "Green", "value": "#00FF00"},
            {"name": "Purple", "value": "#800080"},
            {"name": "Orange", "value": "#FFA500"},
            {"name": "White", "value": "#FFFFFF"},
            {"name": "Black", "value": "#000000"},
            {"name": "Gold", "value": "#FFD700"}
        ];
        
        this.backgrounds = [
            {"name": "White", "value": "#FFFFFF", "type": "color"},
            {"name": "Light Blue", "value": "#87CEEB", "type": "color"},
            {"name": "Light Pink", "value": "#FFB6C1", "type": "color"},
            {"name": "Light Green", "value": "#90EE90", "type": "color"},
            {"name": "Light Yellow", "value": "#FFFFE0", "type": "color"},
            {"name": "Sky Gradient", "value": "linear-gradient(to bottom, #87CEEB, #E0F6FF)", "type": "gradient"},
            {"name": "Grass Field", "value": "#90EE90", "type": "color"},
            {"name": "Rainbow Stripes", "value": "repeating-linear-gradient(45deg, #ff9999, #ff9999 10px, #ffff99 10px, #ffff99 20px, #99ff99 20px, #99ff99 30px, #9999ff 30px, #9999ff 40px)", "type": "gradient"}
        ];
        
        this.textColors = ["#FF0000", "#0000FF", "#008000", "#800080", "#FFA500", "#000000", "#FFFFFF"];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupCanvasSize();
        this.setupBackgroundPanel();
        this.setupKeyboardPanel();
        this.setupContainersPanel();
        this.setupRibbonsPanel();
        this.setupTextModal();
        this.setupCanvasInteractions();
        
        // Initialize delete button state
        this.updateDeleteButtonState();
        
        // Focus canvas initially to enable keyboard input
        setTimeout(() => {
            this.canvas.focus();
        }, 100);
    }
    
    setupEventListeners() {
        // Canvas size selector
        document.getElementById('canvasSizeSelector').addEventListener('change', (e) => this.changeCanvasSize(e.target.value));
        
        // Toolbar buttons
        document.getElementById('backgroundBtn').addEventListener('click', () => this.toggleBackgroundPanel());
        document.getElementById('keyboardBtn').addEventListener('click', () => this.toggleKeyboardPanel());
        document.getElementById('textBtn').addEventListener('click', () => this.showTextModal());
        document.getElementById('containersBtn').addEventListener('click', () => this.toggleContainersPanel());
        document.getElementById('ribbonsBtn').addEventListener('click', () => this.toggleRibbonsPanel());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSelectedItem());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
        
        // Panel close buttons
        document.getElementById('closeBgPanel').addEventListener('click', () => this.hideBackgroundPanel());
        document.getElementById('closeKeyboardPanel').addEventListener('click', () => this.hideKeyboardPanel());
        document.getElementById('closeContainersPanel').addEventListener('click', () => this.hideContainersPanel());
        document.getElementById('closeRibbonsPanel').addEventListener('click', () => this.hideRibbonsPanel());
        document.getElementById('closeTextModal').addEventListener('click', () => this.hideTextModal());
        
        // Container and Ribbon panel buttons
        document.getElementById('addContainerBtn').addEventListener('click', () => this.addSelectedContainer());
        document.getElementById('addRibbonBtn').addEventListener('click', () => this.addSelectedRibbon());
        
        // Text modal buttons
        document.getElementById('addText').addEventListener('click', () => this.addTextToCanvas());
        document.getElementById('cancelText').addEventListener('click', () => this.hideTextModal());
        
        // Context menu
        document.getElementById('deleteContextItem').addEventListener('click', () => this.deleteContextItem());
        
        // Undo button
        document.getElementById('undoBtn').addEventListener('click', () => this.undoDelete());
        
        // Physical keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Canvas interactions
        this.canvas.addEventListener('click', (e) => {
            this.canvas.focus();
            if (e.target === this.canvas) {
                this.deselectAllItems();
                this.hideContextMenu();
            }
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target === this.canvas) {
                this.hideContextMenu();
            }
        });
        
        // Global events for drag and resize
        document.addEventListener('mousemove', (e) => this.handleGlobalMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleGlobalMouseUp(e));
        document.addEventListener('touchmove', (e) => this.handleGlobalTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleGlobalTouchEnd(e));
        
        // Hide context menu on clicks elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#contextMenu')) {
                this.hideContextMenu();
            }
        });
    }
    
    setupCanvasSize() {
        this.changeCanvasSize('laptop');
    }
    
    changeCanvasSize(size) {
        this.currentCanvasSize = size;
        
        // Remove existing size classes
        this.canvas.classList.remove('size-mobile', 'size-ipad', 'size-laptop');
        this.canvas.classList.add(`size-${size}`);
        
        // Update canvas dimensions
        if (size === 'mobile') {
            this.canvas.style.width = '320px';
            this.canvas.style.height = '568px';
        } else if (size === 'ipad') {
            this.canvas.style.width = '768px';
            this.canvas.style.height = '600px';
        } else {
            this.canvas.style.width = '800px';
            this.canvas.style.height = '600px';
        }
        
        this.adjustItemsForNewCanvasSize();
    }
    
    adjustItemsForNewCanvasSize() {
        this.canvasItems.forEach(item => {
            const element = item.element;
            let left = element.offsetLeft;
            let top = element.offsetTop;
            
            // Ensure item stays within new canvas bounds
            if (left + element.offsetWidth > this.canvas.clientWidth) {
                left = this.canvas.clientWidth - element.offsetWidth - 10;
            }
            if (top + element.offsetHeight > this.canvas.clientHeight) {
                top = this.canvas.clientHeight - element.offsetHeight - 10;
            }
            
            element.style.left = Math.max(10, left) + 'px';
            element.style.top = Math.max(10, top) + 'px';
        });
    }
    
    setupBackgroundPanel() {
        const grid = document.getElementById('backgroundGrid');
        grid.innerHTML = '';
        
        this.backgrounds.forEach((bg, index) => {
            const option = document.createElement('div');
            option.className = 'background-option';
            option.style.background = bg.value;
            if (index === 0) option.classList.add('selected');
            
            const label = document.createElement('div');
            label.className = 'background-label';
            label.textContent = bg.name;
            option.appendChild(label);
            
            option.addEventListener('click', () => this.selectBackground(bg, option));
            grid.appendChild(option);
        });
    }
    
    setupKeyboardPanel() {
        const grid = document.getElementById('keyboardGrid');
        grid.innerHTML = '';
        
        Object.entries(this.expandedFlowerMapping).forEach(([key, emoji]) => {
            const keyElement = document.createElement('div');
            keyElement.className = 'keyboard-key';
            keyElement.innerHTML = `
                <div class="key-flower">${emoji}</div>
                <div class="key-letter">${key}</div>
            `;
            keyElement.addEventListener('click', () => this.addFlower(key));
            grid.appendChild(keyElement);
        });
    }
    
    setupContainersPanel() {
        const designsGrid = document.getElementById('containerDesigns');
        const colorsGrid = document.getElementById('containerColors');
        
        // Setup designs
        designsGrid.innerHTML = '';
        this.containerDesigns.forEach((design, index) => {
            const option = document.createElement('div');
            option.className = 'design-option';
            option.innerHTML = `
                <div class="design-emoji">${design.emoji}</div>
                <div class="design-name">${design.name}</div>
            `;
            option.addEventListener('click', () => this.selectContainerDesign(design, option));
            if (index === 0) {
                option.classList.add('selected');
                this.selectedContainerDesign = design;
            }
            designsGrid.appendChild(option);
        });
        
        // Setup colors
        colorsGrid.innerHTML = '';
        this.containerColors.forEach((color, index) => {
            const option = document.createElement('div');
            option.className = 'color-option';
            option.style.backgroundColor = color.value;
            option.setAttribute('data-color', color.value);
            option.addEventListener('click', () => this.selectContainerColor(color, option));
            if (index === 0) {
                option.classList.add('selected');
                this.selectedContainerColor = color;
            }
            colorsGrid.appendChild(option);
        });
    }
    
    setupRibbonsPanel() {
        const designsGrid = document.getElementById('ribbonDesigns');
        const colorsGrid = document.getElementById('ribbonColors');
        
        // Setup designs
        designsGrid.innerHTML = '';
        this.ribbonDesigns.forEach((design, index) => {
            const option = document.createElement('div');
            option.className = 'design-option';
            option.innerHTML = `
                <div class="design-emoji">${design.emoji}</div>
                <div class="design-name">${design.name}</div>
            `;
            option.addEventListener('click', () => this.selectRibbonDesign(design, option));
            if (index === 0) {
                option.classList.add('selected');
                this.selectedRibbonDesign = design;
            }
            designsGrid.appendChild(option);
        });
        
        // Setup colors
        colorsGrid.innerHTML = '';
        this.ribbonColors.forEach((color, index) => {
            const option = document.createElement('div');
            option.className = 'color-option';
            option.style.backgroundColor = color.value;
            option.setAttribute('data-color', color.value);
            option.addEventListener('click', () => this.selectRibbonColor(color, option));
            if (index === 0) {
                option.classList.add('selected');
                this.selectedRibbonColor = color;
            }
            colorsGrid.appendChild(option);
        });
    }
    
    setupTextModal() {
        const colorGrid = document.getElementById('textColorGrid');
        colorGrid.innerHTML = '';
        
        this.textColors.forEach((color, index) => {
            const option = document.createElement('div');
            option.className = 'color-option';
            option.style.backgroundColor = color;
            if (index === 5) option.classList.add('selected'); // Default to black
            option.addEventListener('click', () => this.selectTextColor(option));
            colorGrid.appendChild(option);
        });
    }
    
    setupCanvasInteractions() {
        this.canvas.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (e.target === this.canvas) {
                this.showTextModal();
            }
        });
    }
    
    // Panel toggle methods
    toggleBackgroundPanel() { document.getElementById('backgroundPanel').classList.toggle('hidden'); }
    hideBackgroundPanel() { document.getElementById('backgroundPanel').classList.add('hidden'); }
    toggleKeyboardPanel() { document.getElementById('keyboardPanel').classList.toggle('hidden'); }
    hideKeyboardPanel() { document.getElementById('keyboardPanel').classList.add('hidden'); }
    toggleContainersPanel() { document.getElementById('containersPanel').classList.toggle('hidden'); }
    hideContainersPanel() { document.getElementById('containersPanel').classList.add('hidden'); }
    toggleRibbonsPanel() { document.getElementById('ribbonsPanel').classList.toggle('hidden'); }
    hideRibbonsPanel() { document.getElementById('ribbonsPanel').classList.add('hidden'); }
    
    showTextModal() {
        document.getElementById('textModal').classList.remove('hidden');
        document.getElementById('textInput').focus();
    }
    
    hideTextModal() {
        document.getElementById('textModal').classList.add('hidden');
        document.getElementById('textInput').value = '';
    }
    
    selectBackground(bg, option) {
        document.querySelectorAll('.background-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.canvas.style.background = bg.value;
        this.currentBackground = bg.value;
    }
    
    selectContainerDesign(design, option) {
        document.querySelectorAll('#containerDesigns .design-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedContainerDesign = design;
    }
    
    selectContainerColor(color, option) {
        document.querySelectorAll('#containerColors .color-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedContainerColor = color;
    }
    
    selectRibbonDesign(design, option) {
        document.querySelectorAll('#ribbonDesigns .design-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedRibbonDesign = design;
    }
    
    selectRibbonColor(color, option) {
        document.querySelectorAll('#ribbonColors .color-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedRibbonColor = color;
    }
    
    selectTextColor(option) {
        document.querySelectorAll('#textColorGrid .color-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    }
    
    handleKeyPress(e) {
        const activeElement = document.activeElement;
        const isInInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT';
        const isModalOpen = !document.getElementById('textModal').classList.contains('hidden');
        
        if (isInInput || isModalOpen) return;
        
        // Handle letter and number keys for flowers
        if (e.key.match(/^[a-zA-Z0-9]$/)) {
            e.preventDefault();
            const key = e.key.toUpperCase();
            if (this.expandedFlowerMapping[key]) {
                this.addFlower(key);
            }
        }
        
        // Delete/Backspace key to remove selected item
        if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedItem) {
            e.preventDefault();
            this.deleteSelectedItem();
        }
    }
    
    addFlower(key) {
        const emoji = this.expandedFlowerMapping[key];
        if (!emoji) return;
        
        const item = this.createCanvasItem('flower', emoji, 20); // z-index 20 for flowers
        this.positionItemInCenter(item);
        this.makeItemInteractive(item);
        
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: 'flower',
            content: emoji,
            element: item
        });
        
        // Auto-select the newly added item
        this.selectItem(item);
    }
    
    addSelectedContainer() {
        if (!this.selectedContainerDesign || !this.selectedContainerColor) return;
        
        const item = this.createCanvasItem('container', this.selectedContainerDesign.emoji, 10); // z-index 10 for containers
        
        // Apply color using filter for hue rotation
        this.applyColorToContainer(item, this.selectedContainerColor.value);
        
        this.positionItemInCenter(item);
        this.makeItemInteractive(item);
        
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: 'container',
            content: this.selectedContainerDesign.emoji,
            element: item,
            design: this.selectedContainerDesign,
            color: this.selectedContainerColor
        });
        
        // Auto-select the newly added item
        this.selectItem(item);
        this.hideContainersPanel();
    }
    
    addSelectedRibbon() {
        if (!this.selectedRibbonDesign || !this.selectedRibbonColor) return;
        
        const item = this.createCanvasItem('ribbon', this.selectedRibbonDesign.emoji, 40); // z-index 40 for ribbons
        item.style.color = this.selectedRibbonColor.value;
        
        this.positionItemInCenter(item);
        this.makeItemInteractive(item);
        
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: 'ribbon',
            content: this.selectedRibbonDesign.emoji,
            element: item,
            design: this.selectedRibbonDesign,
            color: this.selectedRibbonColor
        });
        
        // Auto-select the newly added item
        this.selectItem(item);
        this.hideRibbonsPanel();
    }
    
    addTextToCanvas() {
        const text = document.getElementById('textInput').value.trim();
        if (!text) return;
        
        const fontSize = document.getElementById('fontSizeSelect').value;
        const fontFamily = document.getElementById('fontSelect').value;
        const selectedColor = document.querySelector('#textColorGrid .color-option.selected');
        const color = selectedColor ? selectedColor.style.backgroundColor : '#000000';
        
        const item = this.createCanvasItem('text', text, 30); // z-index 30 for text
        item.style.fontSize = fontSize + 'px';
        item.style.fontFamily = fontFamily;
        item.style.color = color;
        
        this.positionItemInCenter(item);
        this.makeItemInteractive(item);
        
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: 'text',
            content: text,
            element: item,
            styles: { fontSize, fontFamily, color }
        });
        
        // Auto-select the newly added item
        this.selectItem(item);
        this.hideTextModal();
    }
    
    applyColorToContainer(item, color) {
        // Convert hex to HSL for better color control
        const hue = this.hexToHue(color);
        item.style.filter = `hue-rotate(${hue}deg) saturate(1.5) brightness(1.1)`;
    }
    
    hexToHue(hex) {
        const colorMap = {
            '#FF0000': 0,    // Red
            '#0000FF': 240,  // Blue
            '#008000': 120,  // Green
            '#FFFF00': 60,   // Yellow
            '#FF69B4': 330,  // Pink
            '#800080': 270,  // Purple
            '#8B4513': 30,   // Brown
            '#FFFFFF': 0,    // White
            '#000000': 0     // Black
        };
        return colorMap[hex] || 0;
    }
    
    createCanvasItem(type, content, zIndex) {
        const item = document.createElement('div');
        item.className = `canvas-item ${type}-item`;
        item.dataset.itemId = this.nextId++;
        item.textContent = content;
        item.style.zIndex = zIndex;
        
        this.canvas.appendChild(item);
        return item;
    }
    
    positionItemInCenter(item) {
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 200;
        
        const canvasWidth = this.canvas.clientWidth;
        const canvasHeight = this.canvas.clientHeight;
        
        const centerX = (canvasWidth / 2) + offsetX;
        const centerY = (canvasHeight / 2) + offsetY;
        
        const maxX = canvasWidth - 80;
        const maxY = canvasHeight - 80;
        
        const finalX = Math.max(10, Math.min(centerX, maxX));
        const finalY = Math.max(10, Math.min(centerY, maxY));
        
        item.style.left = finalX + 'px';
        item.style.top = finalY + 'px';
    }
    
    makeItemInteractive(item) {
        // Mouse and touch events for dragging
        item.addEventListener('mousedown', (e) => this.handleItemMouseDown(e, item));
        item.addEventListener('touchstart', (e) => this.handleItemTouchStart(e, item), { passive: false });
        
        // Right-click for context menu
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.selectItem(item);
            this.showContextMenu(e, item);
        });
    }
    
    handleItemMouseDown(e, item) {
        e.preventDefault();
        e.stopPropagation();
        
        this.startPos = { x: e.clientX, y: e.clientY };
        this.selectItem(item);
        
        // Set up for potential drag
        this.dragData = {
            item: item,
            startX: e.clientX,
            startY: e.clientY,
            initialLeft: parseInt(item.style.left) || 0,
            initialTop: parseInt(item.style.top) || 0,
            hasMoved: false
        };
    }
    
    handleItemTouchStart(e, item) {
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        this.startPos = { x: touch.clientX, y: touch.clientY };
        
        // Long press detection for mobile context menu
        this.longPressTimer = setTimeout(() => {
            this.selectItem(item);
            this.showContextMenu(e, item);
            this.longPressTimer = null;
        }, 800);
        
        this.selectItem(item);
        
        // Set up for potential drag
        this.dragData = {
            item: item,
            startX: touch.clientX,
            startY: touch.clientY,
            initialLeft: parseInt(item.style.left) || 0,
            initialTop: parseInt(item.style.top) || 0,
            hasMoved: false
        };
    }
    
    selectItem(item) {
        this.deselectAllItems();
        item.classList.add('selected');
        this.selectedItem = item;
        this.showResizeHandles(item);
        this.updateDeleteButtonState();
    }
    
    deselectAllItems() {
        document.querySelectorAll('.canvas-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        this.hideResizeHandles();
        this.selectedItem = null;
        this.updateDeleteButtonState();
    }
    
    updateDeleteButtonState() {
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.disabled = !this.selectedItem;
            
            // Update button text to show if it's enabled
            if (this.selectedItem) {
                deleteBtn.classList.remove('btn--outline');
                deleteBtn.classList.add('btn--secondary');
            } else {
                deleteBtn.classList.remove('btn--secondary');
                deleteBtn.classList.add('btn--outline');
            }
        }
    }
    
    showContextMenu(e, item) {
        const contextMenu = document.getElementById('contextMenu');
        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : e.changedTouches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : e.changedTouches[0].clientY);
        
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.remove('hidden');
        
        // Store reference to item for deletion
        contextMenu.dataset.itemId = item.dataset.itemId;
    }
    
    hideContextMenu() {
        document.getElementById('contextMenu').classList.add('hidden');
    }
    
    deleteContextItem() {
        const contextMenu = document.getElementById('contextMenu');
        const itemId = contextMenu.dataset.itemId;
        const item = document.querySelector(`[data-item-id="${itemId}"]`);
        
        if (item) {
            this.deleteItem(item);
        }
        this.hideContextMenu();
    }
    
    deleteSelectedItem() {
        if (this.selectedItem) {
            this.deleteItem(this.selectedItem);
        }
    }
    
    deleteItem(item) {
        // Store for undo functionality
        const itemData = this.canvasItems.find(canvasItem => canvasItem.element === item);
        if (itemData) {
            // Create a deep copy for undo
            const undoData = {
                item: {
                    id: itemData.id,
                    type: itemData.type,
                    content: itemData.content,
                    design: itemData.design,
                    color: itemData.color,
                    styles: itemData.styles
                },
                position: {
                    left: item.style.left,
                    top: item.style.top,
                    width: item.style.width,
                    height: item.style.height,
                    fontSize: item.style.fontSize,
                    fontFamily: item.style.fontFamily,
                    color: item.style.color,
                    filter: item.style.filter,
                    zIndex: item.style.zIndex
                }
            };
            this.undoStack.push(undoData);
            
            // Limit undo stack size
            if (this.undoStack.length > 10) {
                this.undoStack.shift();
            }
        }
        
        // Animate deletion
        item.classList.add('deleting');
        
        setTimeout(() => {
            // Remove from arrays and DOM
            const itemId = item.dataset.itemId;
            this.canvasItems = this.canvasItems.filter(canvasItem => canvasItem.id !== itemId);
            
            if (item.parentNode) {
                item.remove();
            }
            
            if (this.selectedItem === item) {
                this.selectedItem = null;
                this.updateDeleteButtonState();
            }
            this.hideResizeHandles();
            
            // Show undo notification
            this.showUndoNotification();
        }, 300);
    }
    
    showUndoNotification() {
        const notification = document.getElementById('undoNotification');
        if (notification) {
            notification.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (!notification.classList.contains('hidden')) {
                    notification.classList.add('hidden');
                }
            }, 5000);
        }
    }
    
    undoDelete() {
        if (this.undoStack.length === 0) return;
        
        const undoData = this.undoStack.pop();
        const itemData = undoData.item;
        const position = undoData.position;
        
        // Recreate the item
        let item;
        if (itemData.type === 'flower') {
            item = this.createCanvasItem('flower', itemData.content, 20);
        } else if (itemData.type === 'container') {
            item = this.createCanvasItem('container', itemData.content, 10);
            if (itemData.color) {
                this.applyColorToContainer(item, itemData.color.value);
            }
        } else if (itemData.type === 'ribbon') {
            item = this.createCanvasItem('ribbon', itemData.content, 40);
            if (itemData.color) {
                item.style.color = itemData.color.value;
            }
        } else if (itemData.type === 'text') {
            item = this.createCanvasItem('text', itemData.content, 30);
            if (itemData.styles) {
                item.style.fontSize = (itemData.styles.fontSize || 24) + 'px';
                item.style.fontFamily = itemData.styles.fontFamily || 'Arial';
                item.style.color = itemData.styles.color || '#000000';
            }
        }
        
        // Restore position and styling
        Object.keys(position).forEach(key => {
            if (position[key]) {
                item.style[key] = position[key];
            }
        });
        
        this.makeItemInteractive(item);
        
        // Add back to items array
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: itemData.type,
            content: itemData.content,
            element: item,
            design: itemData.design,
            color: itemData.color,
            styles: itemData.styles
        });
        
        // Select the restored item
        this.selectItem(item);
        
        // Hide undo notification
        document.getElementById('undoNotification').classList.add('hidden');
    }
    
    showResizeHandles(item) {
        this.hideResizeHandles();
        
        const handles = document.createElement('div');
        handles.className = 'resize-handles';
        handles.id = 'activeResizeHandles';
        
        ['nw', 'ne', 'sw', 'se'].forEach(direction => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${direction}`;
            handle.dataset.direction = direction;
            handle.addEventListener('mousedown', (e) => this.startResize(e, item, direction));
            handle.addEventListener('touchstart', (e) => this.startResize(e, item, direction), { passive: false });
            handles.appendChild(handle);
        });
        
        item.appendChild(handles);
    }
    
    hideResizeHandles() {
        const existingHandles = document.getElementById('activeResizeHandles');
        if (existingHandles) {
            existingHandles.remove();
        }
    }
    
    startResize(e, item, direction) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        item.classList.add('resizing');
        
        this.resizeData = {
            item: item,
            direction: direction,
            startX: e.type === 'touchstart' ? e.touches[0].clientX : e.clientX,
            startY: e.type === 'touchstart' ? e.touches[0].clientY : e.clientY,
            startWidth: item.offsetWidth,
            startHeight: item.offsetHeight,
            startLeft: item.offsetLeft,
            startTop: item.offsetTop
        };
        
        document.body.style.userSelect = 'none';
    }
    
    handleGlobalMouseMove(e) {
        if (this.isResizing && this.resizeData) {
            this.handleResize(e.clientX, e.clientY);
        } else if (this.dragData && !this.isResizing) {
            const deltaX = e.clientX - this.dragData.startX;
            const deltaY = e.clientY - this.dragData.startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > this.dragThreshold && !this.dragData.hasMoved) {
                this.isDragging = true;
                this.dragData.hasMoved = true;
                this.dragData.item.classList.add('dragging');
                document.body.style.userSelect = 'none';
            }
            
            if (this.isDragging) {
                this.handleDrag(e.clientX, e.clientY);
            }
        }
    }
    
    handleGlobalTouchMove(e) {
        // Clear long press timer if moving
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        if (this.isResizing && this.resizeData) {
            e.preventDefault();
            this.handleResize(e.touches[0].clientX, e.touches[0].clientY);
        } else if (this.dragData && !this.isResizing) {
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.dragData.startX;
            const deltaY = touch.clientY - this.dragData.startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > this.dragThreshold && !this.dragData.hasMoved) {
                e.preventDefault();
                this.isDragging = true;
                this.dragData.hasMoved = true;
                this.dragData.item.classList.add('dragging');
                document.body.style.userSelect = 'none';
            }
            
            if (this.isDragging) {
                e.preventDefault();
                this.handleDrag(touch.clientX, touch.clientY);
            }
        }
    }
    
    handleDrag(clientX, clientY) {
        if (!this.dragData) return;
        
        const deltaX = clientX - this.dragData.startX;
        const deltaY = clientY - this.dragData.startY;
        
        let newLeft = this.dragData.initialLeft + deltaX;
        let newTop = this.dragData.initialTop + deltaY;
        
        // Keep within bounds
        newLeft = Math.max(0, Math.min(newLeft, this.canvas.clientWidth - this.dragData.item.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, this.canvas.clientHeight - this.dragData.item.offsetHeight));
        
        this.dragData.item.style.left = newLeft + 'px';
        this.dragData.item.style.top = newTop + 'px';
    }
    
    handleResize(clientX, clientY) {
        const deltaX = clientX - this.resizeData.startX;
        const deltaY = clientY - this.resizeData.startY;
        const item = this.resizeData.item;
        
        let newWidth = this.resizeData.startWidth;
        let newHeight = this.resizeData.startHeight;
        let newLeft = this.resizeData.startLeft;
        let newTop = this.resizeData.startTop;
        
        // Apply resize based on direction
        switch (this.resizeData.direction) {
            case 'nw':
                newWidth -= deltaX;
                newHeight -= deltaY;
                newLeft += deltaX;
                newTop += deltaY;
                break;
            case 'ne':
                newWidth += deltaX;
                newHeight -= deltaY;
                newTop += deltaY;
                break;
            case 'sw':
                newWidth -= deltaX;
                newHeight += deltaY;
                newLeft += deltaX;
                break;
            case 'se':
                newWidth += deltaX;
                newHeight += deltaY;
                break;
        }
        
        // Maintain minimum size
        const minSize = 30;
        newWidth = Math.max(minSize, newWidth);
        newHeight = Math.max(minSize, newHeight);
        
        // Keep within canvas bounds
        if (newLeft < 0) {
            newWidth += newLeft;
            newLeft = 0;
        }
        if (newTop < 0) {
            newHeight += newTop;
            newTop = 0;
        }
        if (newLeft + newWidth > this.canvas.clientWidth) {
            newWidth = this.canvas.clientWidth - newLeft;
        }
        if (newTop + newHeight > this.canvas.clientHeight) {
            newHeight = this.canvas.clientHeight - newTop;
        }
        
        // Apply new dimensions
        item.style.width = newWidth + 'px';
        item.style.height = newHeight + 'px';
        item.style.left = newLeft + 'px';
        item.style.top = newTop + 'px';
        
        // Adjust font size proportionally
        if (item.classList.contains('text-item')) {
            const baseFontSize = 24;
            const scale = Math.min(newWidth / 100, newHeight / 50);
            item.style.fontSize = Math.max(12, baseFontSize * scale) + 'px';
        } else {
            const scale = Math.min(newWidth / 50, newHeight / 50);
            item.style.fontSize = Math.max(16, 32 * scale) + 'px';
        }
    }
    
    handleGlobalMouseUp(e) {
        this.endDragOrResize();
    }
    
    handleGlobalTouchEnd(e) {
        // Clear long press timer
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        this.endDragOrResize();
    }
    
    endDragOrResize() {
        if (this.isDragging && this.dragData) {
            this.dragData.item.classList.remove('dragging');
            this.isDragging = false;
        }
        
        if (this.isResizing && this.resizeData) {
            this.resizeData.item.classList.remove('resizing');
            this.isResizing = false;
            this.resizeData = null;
        }
        
        this.dragData = null;
        document.body.style.userSelect = '';
    }
    
    clearCanvas() {
        if (this.canvasItems.length === 0) {
            alert('Canvas is already empty!');
            return;
        }
        
        if (confirm('Clear all items from the canvas?')) {
            this.canvasItems.forEach(item => item.element.remove());
            this.canvasItems = [];
            this.selectedItem = null;
            this.undoStack = [];
            this.hideResizeHandles();
            this.updateDeleteButtonState();
        }
    }
    
    async downloadImage() {
        try {
            const canvas = document.getElementById('downloadCanvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size to match the display canvas
            canvas.width = this.canvas.clientWidth;
            canvas.height = this.canvas.clientHeight;
            
            // Fill background
            ctx.fillStyle = this.currentBackground;
            
            // Handle gradients properly
            if (this.currentBackground.includes('gradient')) {
                if (this.currentBackground.includes('Sky Gradient')) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, '#87CEEB');
                    gradient.addColorStop(1, '#E0F6FF');
                    ctx.fillStyle = gradient;
                } else if (this.currentBackground.includes('Rainbow')) {
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    gradient.addColorStop(0, '#ff9999');
                    gradient.addColorStop(0.2, '#ffff99');
                    gradient.addColorStop(0.4, '#99ff99');
                    gradient.addColorStop(0.6, '#9999ff');
                    gradient.addColorStop(0.8, '#ff9999');
                    gradient.addColorStop(1, '#ffff99');
                    ctx.fillStyle = gradient;
                }
            }
            
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Sort items by z-index for proper layering
            const sortedItems = [...this.canvasItems].sort((a, b) => {
                const aZIndex = parseInt(a.element.style.zIndex) || 0;
                const bZIndex = parseInt(b.element.style.zIndex) || 0;
                return aZIndex - bZIndex;
            });
            
            // Draw all canvas items in layer order
            for (const canvasItem of sortedItems) {
                const element = canvasItem.element;
                
                const x = element.offsetLeft;
                const y = element.offsetTop;
                const width = element.offsetWidth;
                const height = element.offsetHeight;
                
                if (canvasItem.type === 'text') {
                    const styles = canvasItem.styles || {};
                    const fontSize = parseInt(element.style.fontSize) || styles.fontSize || 24;
                    ctx.font = `${fontSize}px ${styles.fontFamily || 'Arial'}`;
                    ctx.fillStyle = styles.color || '#000000';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(canvasItem.content, x + 8, y + 8);
                } else {
                    const fontSize = parseInt(element.style.fontSize) || 32;
                    ctx.font = `${fontSize}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = element.style.color || '#000';
                    ctx.fillText(canvasItem.content, x + width/2, y + height/2);
                }
            }
            
            // Create download link
            const timestamp = new Date().getTime();
            const link = document.createElement('a');
            link.download = `flower-art-${timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    }
    
    showSuccessMessage() {
        const message = document.getElementById('successMessage');
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlowerKeyboardApp();
});