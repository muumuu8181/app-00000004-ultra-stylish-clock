/**
 * Ultra Stylish Clock System v1.0
 * Professional Time Management Application
 */

class UltraStylishClock {
    constructor() {
        // Core properties
        this.currentMode = 'clock';
        this.clockType = 'analog';
        this.currentTheme = 'neon';
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.appStartTime = Date.now();
        
        // Timer properties
        this.timerDuration = 300; // 5 minutes default
        this.timerStartTime = 0;
        this.timerRemaining = 0;
        this.timerInterval = null;
        
        // Stopwatch properties
        this.stopwatchInterval = null;
        
        // Clock properties
        this.clockInterval = null;
        this.showSeconds = true;
        this.use24Hour = false;
        this.showDate = true;
        this.animationsEnabled = true;
        this.soundEffectsEnabled = true;
        
        // Canvas elements
        this.clockCanvas = null;
        this.clockCtx = null;
        this.timerCanvas = null;
        this.timerCtx = null;
        this.stopwatchCanvas = null;
        this.stopwatchCtx = null;
        
        // Audio elements
        this.tickSound = null;
        this.timerCompleteSound = null;
        
        // Initialize the application
        this.init();
    }
    
    init() {
        this.setupCanvases();
        this.setupEventListeners();
        this.setupAudio();
        this.startClock();
        this.updateUptime();
        this.loadSettings();
        
        console.log('🕐 Ultra Stylish Clock System initialized successfully!');
    }
    
    setupCanvases() {
        // Clock canvas
        this.clockCanvas = document.getElementById('clock-canvas');
        this.clockCtx = this.clockCanvas.getContext('2d');
        
        // Timer canvas
        this.timerCanvas = document.getElementById('timer-canvas');
        this.timerCtx = this.timerCanvas.getContext('2d');
        
        // Stopwatch canvas
        this.stopwatchCanvas = document.getElementById('stopwatch-canvas');
        this.stopwatchCtx = this.stopwatchCanvas.getContext('2d');
        
        // Set high DPI scaling
        this.setupHighDPI(this.clockCanvas, this.clockCtx);
        this.setupHighDPI(this.timerCanvas, this.timerCtx);
        this.setupHighDPI(this.stopwatchCanvas, this.stopwatchCtx);
    }
    
    setupHighDPI(canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    setupEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.closest('.mode-btn').dataset.mode);
            });
        });
        
        // Clock type switching
        document.getElementById('analog-btn').addEventListener('click', () => {
            this.switchClockType('analog');
        });
        
        document.getElementById('digital-btn').addEventListener('click', () => {
            this.switchClockType('digital');
        });
        
        // Theme switching
        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
        
        // Timer controls
        document.getElementById('timer-start').addEventListener('click', () => {
            this.startTimer();
        });
        
        document.getElementById('timer-pause').addEventListener('click', () => {
            this.pauseTimer();
        });
        
        document.getElementById('timer-reset').addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Timer presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTimerPreset(parseInt(e.target.dataset.time));
            });
        });
        
        // Timer inputs
        document.getElementById('timer-hours').addEventListener('change', () => {
            this.updateTimerFromInputs();
        });
        
        document.getElementById('timer-minutes').addEventListener('change', () => {
            this.updateTimerFromInputs();
        });
        
        document.getElementById('timer-seconds').addEventListener('change', () => {
            this.updateTimerFromInputs();
        });
        
        // Stopwatch controls
        document.getElementById('stopwatch-start').addEventListener('click', () => {
            this.startStopwatch();
        });
        
        document.getElementById('stopwatch-pause').addEventListener('click', () => {
            this.pauseStopwatch();
        });
        
        document.getElementById('stopwatch-lap').addEventListener('click', () => {
            this.addLap();
        });
        
        document.getElementById('stopwatch-reset').addEventListener('click', () => {
            this.resetStopwatch();
        });
        
        // Settings
        document.getElementById('show-seconds').addEventListener('change', (e) => {
            this.showSeconds = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('24-hour').addEventListener('change', (e) => {
            this.use24Hour = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('show-date').addEventListener('change', (e) => {
            this.showDate = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('animations').addEventListener('change', (e) => {
            this.animationsEnabled = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('sound-effects').addEventListener('change', (e) => {
            this.soundEffectsEnabled = e.target.checked;
            this.saveSettings();
        });
        
        // Fullscreen toggle
        document.getElementById('fullscreen-toggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    setupAudio() {
        this.tickSound = document.getElementById('tick-sound');
        this.timerCompleteSound = document.getElementById('timer-complete');
        
        // Create audio context for better sound generation
        if (this.soundEffectsEnabled) {
            this.createAudioTones();
        }
    }
    
    createAudioTones() {
        // This would create audio tones programmatically
        // For now, using data URIs in HTML
    }
    
    // Mode Management
    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active mode button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Update display panels
        document.querySelectorAll('.display-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${mode}-display`).classList.add('active');
        
        // Start appropriate functionality
        if (mode === 'clock') {
            this.startClock();
        } else if (mode === 'timer') {
            this.updateTimerDisplay();
        } else if (mode === 'stopwatch') {
            this.updateStopwatchDisplay();
        }
        
        this.playSound('click');
    }
    
    switchClockType(type) {
        this.clockType = type;
        
        // Update active type button
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${type}-btn`).classList.add('active');
        
        // Update clock displays
        document.getElementById('analog-clock').classList.remove('active');
        document.getElementById('digital-clock').classList.remove('active');
        document.getElementById(`${type}-clock`).classList.add('active');
        
        this.playSound('click');
    }
    
    // Theme Management
    changeTheme(theme) {
        this.currentTheme = theme;
        
        // Remove all theme classes
        document.body.className = '';
        
        // Add new theme class
        if (theme !== 'neon') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        // Update theme info
        document.getElementById('theme-info').textContent = `Theme: ${this.getThemeName(theme)}`;
        
        this.saveSettings();
        this.playSound('whoosh');
    }
    
    getThemeName(theme) {
        const themes = {
            'neon': 'Neon Cyber',
            'aurora': 'Aurora Borealis',
            'cosmic': 'Cosmic Space',
            'minimal': 'Minimal Modern',
            'retro': 'Retro Synthwave',
            'matrix': 'Matrix Green'
        };
        return themes[theme] || 'Unknown';
    }
    
    // Clock Functions
    startClock() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
        
        this.updateClock();
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }
    
    updateClock() {
        const now = new Date();
        
        if (this.clockType === 'analog') {
            this.drawAnalogClock(now);
        } else {
            this.updateDigitalClock(now);
        }
    }
    
    drawAnalogClock(time) {
        const ctx = this.clockCtx;
        const canvas = this.clockCanvas;
        const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
        const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));
        const radius = Math.min(centerX, centerY) - 20;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get theme colors
        const themeColors = this.getThemeColors();
        
        // Draw outer ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = themeColors.primary;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            const outerX = centerX + Math.cos(angle - Math.PI / 2) * (radius - 10);
            const outerY = centerY + Math.sin(angle - Math.PI / 2) * (radius - 10);
            const innerX = centerX + Math.cos(angle - Math.PI / 2) * (radius - 25);
            const innerY = centerY + Math.sin(angle - Math.PI / 2) * (radius - 25);
            
            ctx.beginPath();
            ctx.moveTo(outerX, outerY);
            ctx.lineTo(innerX, innerY);
            ctx.strokeStyle = themeColors.secondary;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw hour numbers
            const textX = centerX + Math.cos(angle - Math.PI / 2) * (radius - 35);
            const textY = centerY + Math.sin(angle - Math.PI / 2) * (radius - 35);
            ctx.fillStyle = themeColors.primary;
            ctx.font = '20px Orbitron';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((i === 0 ? 12 : i).toString(), textX, textY);
        }
        
        // Draw minute markers
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) {
                const angle = (i * Math.PI) / 30;
                const outerX = centerX + Math.cos(angle - Math.PI / 2) * (radius - 5);
                const outerY = centerY + Math.sin(angle - Math.PI / 2) * (radius - 5);
                const innerX = centerX + Math.cos(angle - Math.PI / 2) * (radius - 15);
                const innerY = centerY + Math.sin(angle - Math.PI / 2) * (radius - 15);
                
                ctx.beginPath();
                ctx.moveTo(outerX, outerY);
                ctx.lineTo(innerX, innerY);
                ctx.strokeStyle = themeColors.accent;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Get time components
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        
        // Draw hour hand
        const hourAngle = ((hours + minutes / 60) * Math.PI) / 6;
        const hourEndX = centerX + Math.cos(hourAngle - Math.PI / 2) * (radius * 0.5);
        const hourEndY = centerY + Math.sin(hourAngle - Math.PI / 2) * (radius * 0.5);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(hourEndX, hourEndY);
        ctx.strokeStyle = themeColors.primary;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw minute hand
        const minuteAngle = (minutes * Math.PI) / 30;
        const minuteEndX = centerX + Math.cos(minuteAngle - Math.PI / 2) * (radius * 0.7);
        const minuteEndY = centerY + Math.sin(minuteAngle - Math.PI / 2) * (radius * 0.7);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(minuteEndX, minuteEndY);
        ctx.strokeStyle = themeColors.secondary;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw second hand
        if (this.showSeconds) {
            const secondAngle = (seconds * Math.PI) / 30;
            const secondEndX = centerX + Math.cos(secondAngle - Math.PI / 2) * (radius * 0.9);
            const secondEndY = centerY + Math.sin(secondAngle - Math.PI / 2) * (radius * 0.9);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(secondEndX, secondEndY);
            ctx.strokeStyle = themeColors.accent;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        
        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = themeColors.primary;
        ctx.fill();
    }
    
    updateDigitalClock(time) {
        const timeElement = document.getElementById('digital-time');
        const dateElement = document.getElementById('digital-date');
        const dayElement = document.getElementById('digital-day');
        const timezoneElement = document.getElementById('timezone');
        const ampmElement = document.getElementById('ampm');
        
        // Format time
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        
        let timeString = '';
        let ampm = '';
        
        if (this.use24Hour) {
            timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0) hours = 12;
            timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        
        if (this.showSeconds) {
            timeString += `:${seconds.toString().padStart(2, '0')}`;
        }
        
        timeElement.textContent = timeString;
        ampmElement.textContent = ampm;
        
        // Format date
        if (this.showDate) {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = time.toLocaleDateString('en-US', options);
            
            const dayOptions = { weekday: 'long' };
            dayElement.textContent = time.toLocaleDateString('en-US', dayOptions);
        }
        
        // Update timezone
        timezoneElement.textContent = 'JST';
        
        // Add pulse animation if enabled
        if (this.animationsEnabled && seconds % 2 === 0) {
            timeElement.classList.add('pulse');
            setTimeout(() => {
                timeElement.classList.remove('pulse');
            }, 500);
        }
    }
    
    // Timer Functions
    startTimer() {
        if (this.timerRemaining <= 0) {
            this.timerRemaining = this.timerDuration;
        }
        
        this.timerStartTime = Date.now();
        this.isRunning = true;
        
        document.getElementById('timer-start').disabled = true;
        document.getElementById('timer-pause').disabled = false;
        
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 100);
        
        this.playSound('start');
    }
    
    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        
        this.playSound('pause');
    }
    
    resetTimer() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.timerRemaining = this.timerDuration;
        
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        
        this.updateTimerDisplay();
        this.playSound('reset');
    }
    
    updateTimer() {
        if (!this.isRunning) return;
        
        const elapsed = Date.now() - this.timerStartTime;
        this.timerRemaining = Math.max(0, this.timerDuration * 1000 - elapsed);
        
        if (this.timerRemaining <= 0) {
            this.timerComplete();
        }
        
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        const totalSeconds = Math.ceil(this.timerRemaining / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer-time').textContent = timeString;
        
        // Update progress
        const progress = (this.timerDuration * 1000 - this.timerRemaining) / (this.timerDuration * 1000);
        document.getElementById('timer-progress').textContent = 
            this.isRunning ? `${Math.round(progress * 100)}% Complete` : 'Ready to start';
        
        // Draw timer circle
        this.drawTimerCircle(progress);
    }
    
    drawTimerCircle(progress) {
        const ctx = this.timerCtx;
        const canvas = this.timerCanvas;
        const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
        const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));
        const radius = Math.min(centerX, centerY) - 20;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const themeColors = this.getThemeColors();
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = themeColors.secondary + '30';
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // Draw progress arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
        ctx.strokeStyle = themeColors.primary;
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw center glow
        if (this.animationsEnabled) {
            const glowRadius = 30 + Math.sin(Date.now() / 500) * 5;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
            gradient.addColorStop(0, themeColors.primary + '40');
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, glowRadius, 0, 2 * Math.PI);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    timerComplete() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        
        // Visual feedback
        document.getElementById('timer-display').classList.add('glow');
        setTimeout(() => {
            document.getElementById('timer-display').classList.remove('glow');
        }, 2000);
        
        // Audio feedback
        this.playSound('complete');
        
        // Reset for next use
        this.timerRemaining = this.timerDuration;
        this.updateTimerDisplay();
    }
    
    setTimerPreset(seconds) {
        this.timerDuration = seconds;
        this.timerRemaining = seconds;
        
        // Update input fields
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        document.getElementById('timer-hours').value = hours;
        document.getElementById('timer-minutes').value = minutes;
        document.getElementById('timer-seconds').value = secs;
        
        this.updateTimerDisplay();
        this.playSound('click');
    }
    
    updateTimerFromInputs() {
        const hours = parseInt(document.getElementById('timer-hours').value) || 0;
        const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;
        
        this.timerDuration = (hours * 3600) + (minutes * 60) + seconds;
        this.timerRemaining = this.timerDuration;
        
        this.updateTimerDisplay();
    }
    
    // Stopwatch Functions
    startStopwatch() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.isRunning = true;
            
            document.getElementById('stopwatch-start').disabled = true;
            document.getElementById('stopwatch-pause').disabled = false;
            document.getElementById('stopwatch-lap').disabled = false;
            
            this.stopwatchInterval = setInterval(() => {
                this.updateStopwatch();
            }, 10);
            
            this.playSound('start');
        }
    }
    
    pauseStopwatch() {
        this.isRunning = false;
        clearInterval(this.stopwatchInterval);
        
        document.getElementById('stopwatch-start').disabled = false;
        document.getElementById('stopwatch-pause').disabled = true;
        document.getElementById('stopwatch-lap').disabled = true;
        
        this.playSound('pause');
    }
    
    resetStopwatch() {
        this.isRunning = false;
        clearInterval(this.stopwatchInterval);
        this.elapsedTime = 0;
        this.lapTimes = [];
        
        document.getElementById('stopwatch-start').disabled = false;
        document.getElementById('stopwatch-pause').disabled = true;
        document.getElementById('stopwatch-lap').disabled = true;
        
        this.updateStopwatchDisplay();
        this.updateLapDisplay();
        this.playSound('reset');
    }
    
    updateStopwatch() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        this.updateStopwatchDisplay();
    }
    
    updateStopwatchDisplay() {
        const totalMs = this.elapsedTime;
        const totalSeconds = Math.floor(totalMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = totalMs % 1000;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const msString = `.${milliseconds.toString().padStart(3, '0')}`;
        
        document.getElementById('stopwatch-time').textContent = timeString;
        document.getElementById('stopwatch-milliseconds').textContent = msString;
        
        // Draw stopwatch circle
        this.drawStopwatchCircle();
    }
    
    drawStopwatchCircle() {
        const ctx = this.stopwatchCtx;
        const canvas = this.stopwatchCanvas;
        const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
        const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));
        const radius = Math.min(centerX, centerY) - 20;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const themeColors = this.getThemeColors();
        
        // Draw background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = themeColors.secondary + '30';
        ctx.lineWidth = 8;
        ctx.stroke();
        
        // Draw animated progress ring
        if (this.isRunning) {
            const seconds = (this.elapsedTime / 1000) % 60;
            const progress = seconds / 60;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
            ctx.strokeStyle = themeColors.primary;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
        
        // Draw lap indicators
        this.lapTimes.forEach((lap, index) => {
            const lapSeconds = (lap / 1000) % 60;
            const lapAngle = (lapSeconds / 60) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + Math.cos(lapAngle) * radius;
            const y = centerY + Math.sin(lapAngle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = themeColors.accent;
            ctx.fill();
        });
        
        // Draw center pulse
        if (this.animationsEnabled && this.isRunning) {
            const pulseRadius = 15 + Math.sin(Date.now() / 200) * 3;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
            gradient.addColorStop(0, themeColors.primary + '60');
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    addLap() {
        if (this.isRunning) {
            this.lapTimes.unshift(this.elapsedTime);
            this.updateLapDisplay();
            this.playSound('lap');
        }
    }
    
    updateLapDisplay() {
        const lapList = document.getElementById('lap-list');
        
        if (this.lapTimes.length === 0) {
            lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
            return;
        }
        
        lapList.innerHTML = '';
        
        this.lapTimes.forEach((lapTime, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${this.lapTimes.length - index}`;
            
            const lapTimeSpan = document.createElement('span');
            lapTimeSpan.className = 'lap-time';
            
            const totalMs = lapTime;
            const totalSeconds = Math.floor(totalMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const milliseconds = totalMs % 1000;
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
            lapTimeSpan.textContent = timeString;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTimeSpan);
            lapList.appendChild(lapItem);
        });
    }
    
    // Utility Functions
    getThemeColors() {
        const computedStyle = getComputedStyle(document.documentElement);
        
        return {
            primary: computedStyle.getPropertyValue('--theme-primary').trim(),
            secondary: computedStyle.getPropertyValue('--theme-secondary').trim(),
            accent: computedStyle.getPropertyValue('--theme-accent').trim()
        };
    }
    
    playSound(type) {
        if (!this.soundEffectsEnabled) return;
        
        try {
            if (type === 'complete' && this.timerCompleteSound) {
                this.timerCompleteSound.currentTime = 0;
                this.timerCompleteSound.play();
            } else if (this.tickSound) {
                this.tickSound.currentTime = 0;
                this.tickSound.play();
            }
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }
    
    updateUptime() {
        setInterval(() => {
            const uptime = Math.floor((Date.now() - this.appStartTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;
            
            let uptimeString = '';
            if (hours > 0) {
                uptimeString = `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                uptimeString = `${minutes}m ${seconds}s`;
            } else {
                uptimeString = `${seconds}s`;
            }
            
            document.getElementById('uptime').textContent = `Uptime: ${uptimeString}`;
        }, 1000);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('Fullscreen request failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    handleKeyboard(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case '1':
                    e.preventDefault();
                    this.switchMode('clock');
                    break;
                case '2':
                    e.preventDefault();
                    this.switchMode('timer');
                    break;
                case '3':
                    e.preventDefault();
                    this.switchMode('stopwatch');
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        }
        
        // Space bar controls
        if (e.code === 'Space') {
            e.preventDefault();
            
            if (this.currentMode === 'timer') {
                if (this.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
            } else if (this.currentMode === 'stopwatch') {
                if (this.isRunning) {
                    this.pauseStopwatch();
                } else {
                    this.startStopwatch();
                }
            }
        }
        
        // Escape key
        if (e.key === 'Escape' && document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            showSeconds: this.showSeconds,
            use24Hour: this.use24Hour,
            showDate: this.showDate,
            animationsEnabled: this.animationsEnabled,
            soundEffectsEnabled: this.soundEffectsEnabled
        };
        
        localStorage.setItem('ultra-clock-settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('ultra-clock-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (settings.theme) {
                    this.changeTheme(settings.theme);
                    document.getElementById('theme-select').value = settings.theme;
                }
                
                if (settings.hasOwnProperty('showSeconds')) {
                    this.showSeconds = settings.showSeconds;
                    document.getElementById('show-seconds').checked = settings.showSeconds;
                }
                
                if (settings.hasOwnProperty('use24Hour')) {
                    this.use24Hour = settings.use24Hour;
                    document.getElementById('24-hour').checked = settings.use24Hour;
                }
                
                if (settings.hasOwnProperty('showDate')) {
                    this.showDate = settings.showDate;
                    document.getElementById('show-date').checked = settings.showDate;
                }
                
                if (settings.hasOwnProperty('animationsEnabled')) {
                    this.animationsEnabled = settings.animationsEnabled;
                    document.getElementById('animations').checked = settings.animationsEnabled;
                }
                
                if (settings.hasOwnProperty('soundEffectsEnabled')) {
                    this.soundEffectsEnabled = settings.soundEffectsEnabled;
                    document.getElementById('sound-effects').checked = settings.soundEffectsEnabled;
                }
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
}

// Initialize the clock application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.clockApp = new UltraStylishClock();
});

// Handle visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (window.clockApp) {
        if (document.hidden) {
            // Pause animations when tab is not visible
            console.log('🕐 Clock paused (tab hidden)');
        } else {
            // Resume animations when tab becomes visible
            console.log('🕐 Clock resumed (tab visible)');
            window.clockApp.updateClock();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.clockApp) {
        // Recalculate canvas dimensions
        window.clockApp.setupCanvases();
    }
});

console.log('🕐 Ultra Stylish Clock System script loaded successfully!');