export default class Queue {
	private guests: string[] = [];
	private generator: IterableIterator<string>;
	private current: string;

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
		return this.current = this.generator.next().value;
	}

	public whosWithIt() {
		return this.current;
	}

	public clear() {
		this.guests = [];
		this.current = "";
	}

	private isPersonInQueue(name: string) {
		return this.guests.find((g) => g === name);
	}

	private* setupGenerator() {
		while (true) {
			if (this.guests.length === 0) {
				yield "";
			}
			for (const person of this.guests) {
				yield person;
			}
		}
	}
};
