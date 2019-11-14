import {LatLngExpression, MarkerOptions} from 'leaflet';

export class Marker {
    id: number;
    name: String;
    description: String;
    position: LatLngExpression;
    options: MarkerOptions;
    constructor(id, name, description, position, options){
        this.id = id;
        this.name = name;
        this.description = description;
        this.position = position;
        this.options = options;
    }
}