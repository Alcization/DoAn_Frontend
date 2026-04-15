
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";

/**
 * The FullscreenControl options object
 */
export type FullscreenControlOptions = {
    /**
     * `container` is the compatible DOM element which should be made full screen. 
     * By default, the map container element will be made full screen.
     */
    container?: HTMLElement;
};

/**
 * A FullscreenControl control contains a button for toggling the map in and out of fullscreen mode.
 * When requestFullscreen is not supported, fullscreen is handled via CSS properties.
 * The map's cooperativeGestures option is temporarily disabled while the map
 * is in fullscreen mode, and is restored when the map exist fullscreen mode.
 */
export class FullscreenControl extends (vietmapgl as any).Evented {
    _map: any;
    _controlContainer!: HTMLDivElement;
    _fullscreen: boolean;
    _fullscreenchange!: string;
    _fullscreenButton!: HTMLButtonElement;
    _container!: HTMLElement;
    _prevCooperativeGesturesEnabled!: boolean;

    constructor(options: FullscreenControlOptions = {}) {
        super();
        this._fullscreen = false;

        if (options && options.container) {
            if (options.container instanceof HTMLElement) {
                this._container = options.container;
            } else {
                console.warn('Full screen control \'container\' must be a DOM element.');
            }
        }

        if ('onfullscreenchange' in document) {
            this._fullscreenchange = 'fullscreenchange';
        } else if ('onmozfullscreenchange' in document) {
            this._fullscreenchange = 'mozfullscreenchange';
        } else if ('onwebkitfullscreenchange' in document) {
            this._fullscreenchange = 'webkitfullscreenchange';
        } else if ('onmsfullscreenchange' in document) {
            this._fullscreenchange = 'MSFullscreenChange';
        }
    }

    /**
     * Register a control on the map and give it a chance to register event listeners and resources. 
     * This method is called by Map#addControl internally.
     */
    onAdd(map: any): HTMLElement {
        this._map = map;
        if (!this._container) this._container = this._map.getContainer();
        
        this._controlContainer = document.createElement('div');
        this._controlContainer.className = 'vietmapgl-ctrl vietmapgl-ctrl-group';
        
        this._setupUI();
        return this._controlContainer;
    }

    /**
     * Unregister a control on the map and give it a chance to detach event listeners and resources. 
     * This method is called by Map#removeControl internally.
     */
    onRemove() {
        if (this._controlContainer.parentNode) {
            this._controlContainer.parentNode.removeChild(this._controlContainer);
        }
        this._map = null;
        window.document.removeEventListener(this._fullscreenchange, this._onFullscreenChange);
    }

    _setupUI() {
        const button = this._fullscreenButton = document.createElement('button');
        button.className = 'vietmapgl-ctrl-fullscreen';
        button.type = 'button';
        
        const icon = document.createElement('span');
        icon.className = 'vietmapgl-ctrl-icon';
        icon.setAttribute('aria-hidden', 'true');
        button.appendChild(icon);
        
        this._controlContainer.appendChild(button);
        
        this._updateTitle();
        this._fullscreenButton.addEventListener('click', this._onClickFullscreen);
        window.document.addEventListener(this._fullscreenchange, this._onFullscreenChange);
    }

    _updateTitle() {
        const title = this._isFullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen';
        this._fullscreenButton.setAttribute('aria-label', title);
        this._fullscreenButton.title = title;
    }

    _isFullscreen() {
        return this._fullscreen;
    }

    _onFullscreenChange = () => {
        let fullscreenElement =
            window.document.fullscreenElement ||
            (window.document as any).mozFullScreenElement ||
            (window.document as any).webkitFullscreenElement ||
            (window.document as any).msFullscreenElement;

        while (fullscreenElement?.shadowRoot?.fullscreenElement) {
            fullscreenElement = fullscreenElement.shadowRoot.fullscreenElement;
        }

        if ((fullscreenElement === this._container) !== this._fullscreen) {
            this._handleFullscreenChange();
        }
    };

    _handleFullscreenChange() {
        this._fullscreen = !this._fullscreen;
        this._fullscreenButton.classList.toggle('vietmapgl-ctrl-shrink');
        this._fullscreenButton.classList.toggle('vietmapgl-ctrl-fullscreen');
        this._updateTitle();

        if (this._fullscreen) {
            this.fire({ type: 'fullscreenstart' });
            if (this._map.cooperativeGestures) {
                this._prevCooperativeGesturesEnabled = this._map.cooperativeGestures.isEnabled();
                this._map.cooperativeGestures.disable();
            }
        } else {
            this.fire({ type: 'fullscreenend' });
            if (this._prevCooperativeGesturesEnabled && this._map.cooperativeGestures) {
                this._map.cooperativeGestures.enable();
            }
        }
    }

    _onClickFullscreen = () => {
        if (this._isFullscreen()) {
            this._exitFullscreen();
        } else {
            this._requestFullscreen();
        }
    };

    _exitFullscreen() {
        if (window.document.exitFullscreen) {
            window.document.exitFullscreen();
        } else if ((window.document as any).mozCancelFullScreen) {
            (window.document as any).mozCancelFullScreen();
        } else if ((window.document as any).msExitFullscreen) {
            (window.document as any).msExitFullscreen();
        } else if ((window.document as any).webkitCancelFullScreen) {
            (window.document as any).webkitCancelFullScreen();
        } else {
            this._togglePseudoFullScreen();
        }
    }

    _requestFullscreen() {
        if (this._container.requestFullscreen) {
            this._container.requestFullscreen();
        } else if ((this._container as any).mozRequestFullScreen) {
            (this._container as any).mozRequestFullScreen();
        } else if ((this._container as any).msRequestFullscreen) {
            (this._container as any).msRequestFullscreen();
        } else if ((this._container as any).webkitRequestFullscreen) {
            (this._container as any).webkitRequestFullscreen();
        } else {
            this._togglePseudoFullScreen();
        }
    }

    _togglePseudoFullScreen() {
        this._container.classList.toggle('vietmapgl-pseudo-fullscreen');
        this._handleFullscreenChange();
        this._map.resize();
    }
}
