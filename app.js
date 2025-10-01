// Flower Keyboard App JavaScript

class FlowerKeyboardApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvasItems = [];
        this.selectedItem = null;
        this.dragData = null;
        this.nextId = 1;
        this.currentBackground = '#FFFFFF';
        this.isDragging = false;
        
        // App data
        this.flowerMapping = {
            "A": "🌸", "B": "🌺", "C": "🌻", "D": "🌷", "E": "🌹", "F": "🌼", 
            "G": "🌿", "H": "🍀", "I": "🌱", "J": "🌙", "K": "⭐", "L": "🌊", 
            "M": "🌈", "N": "☀️", "O": "🌞", "P": "🌕", "Q": "❄️", "R": "🦋", 
            "S": "🐛", "T": "🐝", "U": "🐞", "V": "🦋", "W": "🌾", "X": "🍄", 
            "Y": "🌳", "Z": "🌲"
        };
        
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
        
        this.textColors = ["#FF0000", "#0000FF", "#008000", "#800080", "#FFA500", "#000000"];
        this.textFonts = ["Arial", "Comic Sans MS", "Courier New"];
        this.textSizes = [16, 24, 32];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupBackgroundPanel();
        this.setupKeyboardPanel();
        this.setupTextModal();
        this.setupCanvasInteractions();
        
        // Focus canvas initially to enable keyboard input
        setTimeout(() => {
            this.canvas.focus();
        }, 100);
    }
    
    setupEventListeners() {
        // Toolbar buttons
        document.getElementById('backgroundBtn').addEventListener('click', () => this.toggleBackgroundPanel());
        document.getElementById('keyboardBtn').addEventListener('click', () => this.toggleKeyboardPanel());
        document.getElementById('textBtn').addEventListener('click', () => this.showTextModal());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
        
        // Panel close buttons
        document.getElementById('closeBgPanel').addEventListener('click', () => this.hideBackgroundPanel());
        document.getElementById('closeKeyboardPanel').addEventListener('click', () => this.hideKeyboardPanel());
        document.getElementById('closeTextModal').addEventListener('click', () => this.hideTextModal());
        
        // Text modal buttons
        document.getElementById('addText').addEventListener('click', () => this.addTextToCanvas());
        document.getElementById('cancelText').addEventListener('click', () => this.hideTextModal());
        
        // Physical keyboard support - use document level to capture all keys
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Canvas interactions
        this.canvas.addEventListener('click', (e) => {
            this.canvas.focus();
            // If clicking on empty canvas area, deselect items
            if (e.target === this.canvas) {
                this.deselectAllItems();
            }
        });
        
        // Prevent default context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Global drag events
        document.addEventListener('mousemove', (e) => this.handleGlobalMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleGlobalMouseUp(e));
        document.addEventListener('touchmove', (e) => this.handleGlobalTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleGlobalTouchEnd(e));
    }
    
    setupBackgroundPanel() {
        const grid = document.getElementById('backgroundGrid');
        grid.innerHTML = '';
        
        this.backgrounds.forEach((bg, index) => {
            const option = document.createElement('div');
            option.className = 'background-option';
            option.style.background = bg.value;
            if (index === 0) option.classList.add('selected'); // Default to first option
            
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
        
        Object.entries(this.flowerMapping).forEach(([letter, flower]) => {
            const key = document.createElement('div');
            key.className = 'keyboard-key';
            key.innerHTML = `
                <div class="key-flower">${flower}</div>
                <div class="key-letter">${letter}</div>
            `;
            key.addEventListener('click', () => this.addFlower(letter));
            grid.appendChild(key);
        });
    }
    
    setupTextModal() {
        const colorGrid = document.getElementById('colorGrid');
        colorGrid.innerHTML = '';
        
        this.textColors.forEach((color, index) => {
            const option = document.createElement('div');
            option.className = 'color-option';
            option.style.backgroundColor = color;
            if (index === 5) option.classList.add('selected'); // Default to black
            option.addEventListener('click', () => this.selectColor(option));
            colorGrid.appendChild(option);
        });
    }
    
    setupCanvasInteractions() {
        // Double-click to add text
        this.canvas.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (e.target === this.canvas) {
                this.showTextModal();
            }
        });
    }
    
    toggleBackgroundPanel() {
        const panel = document.getElementById('backgroundPanel');
        panel.classList.toggle('hidden');
    }
    
    hideBackgroundPanel() {
        document.getElementById('backgroundPanel').classList.add('hidden');
    }
    
    toggleKeyboardPanel() {
        const panel = document.getElementById('keyboardPanel');
        panel.classList.toggle('hidden');
    }
    
    hideKeyboardPanel() {
        document.getElementById('keyboardPanel').classList.add('hidden');
    }
    
    showTextModal() {
        document.getElementById('textModal').classList.remove('hidden');
        document.getElementById('textInput').focus();
    }
    
    hideTextModal() {
        document.getElementById('textModal').classList.add('hidden');
        document.getElementById('textInput').value = '';
    }
    
    selectBackground(bg, option) {
        // Remove previous selection
        document.querySelectorAll('.background-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Apply background
        this.canvas.style.background = bg.value;
        this.currentBackground = bg.value;
    }
    
    selectColor(option) {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
    }
    
    handleKeyPress(e) {
        // Check if we're in an input field or modal
        const activeElement = document.activeElement;
        const isInInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT';
        const isModalOpen = !document.getElementById('textModal').classList.contains('hidden');
        
        // Don't handle if in input or modal is open
        if (isInInput || isModalOpen) return;
        
        // Handle letter keys for flowers
        if (e.key.match(/^[a-zA-Z]$/)) {
            e.preventDefault();
            const letter = e.key.toUpperCase();
            if (this.flowerMapping[letter]) {
                this.addFlower(letter);
            }
        }
        
        // Delete key to remove selected item
        if (e.key === 'Delete' && this.selectedItem) {
            e.preventDefault();
            this.deleteItem(this.selectedItem);
        }
    }
    
    addFlower(letter) {
        const flower = this.flowerMapping[letter];
        if (!flower) return;
        
        const item = this.createCanvasItem('flower', flower);
        this.positionItemInCenter(item);
        this.makeItemDraggable(item);
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: 'flower',
            content: flower,
            element: item
        });
    }
    
    addTextToCanvas() {
        const text = document.getElementById('textInput').value.trim();
        if (!text) return;
        
        const fontSize = document.getElementById('fontSizeSelect').value;
        const fontFamily = document.getElementById('fontSelect').value;
        const selectedColor = document.querySelector('.color-option.selected');
        const color = selectedColor ? selectedColor.style.backgroundColor : '#000000';
        
        const item = this.createCanvasItem('text', text);
        item.style.fontSize = fontSize + 'px';
        item.style.fontFamily = fontFamily;
        item.style.color = color;
        
        this.positionItemInCenter(item);
        this.makeItemDraggable(item);
        
        this.canvasItems.push({
            id: item.dataset.itemId,
            type: 'text',
            content: text,
            element: item,
            styles: { fontSize, fontFamily, color }
        });
        
        this.hideTextModal();
    }
    
    createCanvasItem(type, content) {
        const item = document.createElement('div');
        item.className = `canvas-item ${type}-item`;
        item.dataset.itemId = this.nextId++;
        item.textContent = content;
        
        if (type === 'flower') {
            item.classList.add('flower-item');
        }
        
        this.canvas.appendChild(item);
        return item;
    }
    
    positionItemInCenter(item) {
        // Add some randomness to avoid overlapping
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 200;
        
        const canvasWidth = this.canvas.clientWidth;
        const canvasHeight = this.canvas.clientHeight;
        
        const centerX = (canvasWidth / 2) + offsetX;
        const centerY = (canvasHeight / 2) + offsetY;
        
        // Ensure item stays within bounds
        const maxX = canvasWidth - 60; // account for item width
        const maxY = canvasHeight - 60; // account for item height
        
        const finalX = Math.max(10, Math.min(centerX, maxX));
        const finalY = Math.max(10, Math.min(centerY, maxY));
        
        item.style.left = finalX + 'px';
        item.style.top = finalY + 'px';
    }
    
    makeItemDraggable(item) {
        // Mouse down event
        item.addEventListener('mousedown', (e) => this.startDrag(e, item));
        
        // Touch start event
        item.addEventListener('touchstart', (e) => this.startDrag(e, item), { passive: false });
        
        // Click event (for selection without dragging)
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.isDragging) {
                this.selectItem(item);
            }
        });
        
        // Right-click for deletion
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.selectItem(item);
            this.deleteItem(item);
        });
    }
    
    startDrag(e, item) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.dragData = {
            item: item,
            startX: e.type === 'touchstart' ? e.touches[0].clientX : e.clientX,
            startY: e.type === 'touchstart' ? e.touches[0].clientY : e.clientY,
            initialLeft: parseInt(item.style.left) || 0,
            initialTop: parseInt(item.style.top) || 0
        };
        
        this.selectItem(item);
        item.classList.add('dragging');
        document.body.style.userSelect = 'none';
        this.canvas.style.cursor = 'grabbing';
    }
    
    handleGlobalMouseMove(e) {
        if (this.isDragging && this.dragData) {
            this.handleDrag(e.clientX, e.clientY);
        }
    }
    
    handleGlobalTouchMove(e) {
        if (this.isDragging && this.dragData) {
            e.preventDefault();
            this.handleDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }
    
    handleDrag(clientX, clientY) {
        const deltaX = clientX - this.dragData.startX;
        const deltaY = clientY - this.dragData.startY;
        
        let newLeft = this.dragData.initialLeft + deltaX;
        let newTop = this.dragData.initialTop + deltaY;
        
        // Keep item within canvas bounds
        const canvasRect = this.canvas.getBoundingClientRect();
        const itemRect = this.dragData.item.getBoundingClientRect();
        
        newLeft = Math.max(0, Math.min(newLeft, this.canvas.clientWidth - this.dragData.item.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, this.canvas.clientHeight - this.dragData.item.offsetHeight));
        
        this.dragData.item.style.left = newLeft + 'px';
        this.dragData.item.style.top = newTop + 'px';
    }
    
    handleGlobalMouseUp(e) {
        this.endDrag();
    }
    
    handleGlobalTouchEnd(e) {
        this.endDrag();
    }
    
    endDrag() {
        if (this.isDragging && this.dragData) {
            this.dragData.item.classList.remove('dragging');
            document.body.style.userSelect = '';
            this.canvas.style.cursor = 'crosshair';
            
            this.isDragging = false;
            this.dragData = null;
        }
    }
    
    selectItem(item) {
        this.deselectAllItems();
        item.classList.add('selected');
        this.selectedItem = item;
    }
    
    deselectAllItems() {
        document.querySelectorAll('.canvas-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        this.selectedItem = null;
    }
    
    deleteItem(item) {
        if (confirm('Delete this item?')) {
            const itemId = item.dataset.itemId;
            this.canvasItems = this.canvasItems.filter(canvasItem => canvasItem.id !== itemId);
            item.remove();
            if (this.selectedItem === item) {
                this.selectedItem = null;
            }
        }
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
            if (this.currentBackground.includes('gradient')) {
                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                if (this.currentBackground.includes('Sky Gradient')) {
                    gradient.addColorStop(0, '#87CEEB');
                    gradient.addColorStop(1, '#E0F6FF');
                } else if (this.currentBackground.includes('Rainbow')) {
                    gradient.addColorStop(0, '#ff9999');
                    gradient.addColorStop(0.25, '#ffff99');
                    gradient.addColorStop(0.5, '#99ff99');
                    gradient.addColorStop(0.75, '#9999ff');
                    gradient.addColorStop(1, '#ff9999');
                }
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = this.currentBackground;
            }
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw all canvas items
            for (const canvasItem of this.canvasItems) {
                const element = canvasItem.element;
                
                const x = element.offsetLeft;
                const y = element.offsetTop;
                
                if (canvasItem.type === 'flower') {
                    ctx.font = '32px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#000';
                    ctx.fillText(canvasItem.content, x + 25, y + 25);
                } else if (canvasItem.type === 'text') {
                    const styles = canvasItem.styles || {};
                    ctx.font = `${styles.fontSize || 24}px ${styles.fontFamily || 'Arial'}`;
                    ctx.fillStyle = styles.color || '#000000';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(canvasItem.content, x + 8, y + 8);
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