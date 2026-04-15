
import vietmapgl from "@vietmap/vietmap-gl-js/dist/vietmap-gl";

export class ZoomToBoundsControl {
    _map: any;
    _controlContainer: HTMLDivElement | null = null;
    _button: HTMLButtonElement | null = null;
    _onZoom: () => void;

    constructor(onZoom: () => void) {
        this._onZoom = onZoom;
    }

    onAdd(map: any): HTMLElement {
        this._map = map;
        this._controlContainer = document.createElement('div');
        this._controlContainer.className = 'vietmapgl-ctrl vietmapgl-ctrl-group';
        
        const button = this._button = document.createElement('button');
        button.className = 'vietmapgl-ctrl-icon';
        button.type = 'button';
        button.title = 'Zoom to Route';
        button.setAttribute('aria-label', 'Zoom to Route');
        
        // Focus/Target-like SVG icon to match Geolocate style
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M3 12h4"></path>
                <path d="M17 12h4"></path>
                <path d="M12 3v4"></path>
                <path d="M12 17v4"></path>
            </svg>
        `;
        
        button.addEventListener('click', () => {
            this._onZoom();
        });
        
        this._controlContainer.appendChild(button);
        return this._controlContainer;
    }

    onRemove() {
        if (this._controlContainer && this._controlContainer.parentNode) {
            this._controlContainer.parentNode.removeChild(this._controlContainer);
        }
        this._map = null;
    }
}
