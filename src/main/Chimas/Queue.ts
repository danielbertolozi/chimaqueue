export default class Queue {
	private guests: string[] = [];
	private generator: IterableIterator<string>;

	constructor(private readonly name: string) {
		this.generator = this.setupGenerator();
	}
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

	public whosNext() {
		return this.generator.next().value;
	}

	private isPersonInQueue(name: string) {
		return this.guests.find((g) => g === name);
	}

	private* setupGenerator() {
		while (true) {
			for (const person of this.guests) {
				yield person;
			}
		}
	}
};
