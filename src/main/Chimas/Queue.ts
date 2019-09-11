export default class Queue {
	private guests: string[] = [];
	constructor(private readonly name: string) {}
	public add(name: string) {
		this.guests.push(name);
	}
	public getName() {
		return this.name;
	}
	public remove(name: string) {
		this.guests = this.guests.filter((guest) => guest !== name);
	}
	public getGuestList() {
		return this.guests;
	}
};
