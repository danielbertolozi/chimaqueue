export default class Queue {
	private guests: string[] = [];
	constructor(private readonly name: string) {}
	public add(name: string) {
		if (this.isPersonInQueue(name)) {
			throw new Error("Person already in queue");
		}
		this.guests.push(name);
	}
	
	public getName() {
		return this.name;
	}
	public remove(name: string) {
		if (!this.isPersonInQueue(name)) {
			throw new Error("Person not in queue");
		}
		this.guests = this.guests.filter((guest) => guest !== name);
	}
	public getGuestList() {
		return this.guests;
	}

	private isPersonInQueue(name: string) {
		return this.guests.find((g) => g === name);
	}
};
