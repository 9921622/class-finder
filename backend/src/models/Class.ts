const classes: Class[] = [];

export class Class {
    constructor(
        public name: string,
        public building: string,
        public location: string,
        public start: string,
        public end: string
    ) {}
}

export function createClass(
        name: string,
        building: string,
        location: string,
        start: string,
        end: string) {
    const c = new Class(name, building, location, start, end);
    classes.push(c);
    return c;
}

export function getAllClasses(): readonly Class[] {
  return classes;
}