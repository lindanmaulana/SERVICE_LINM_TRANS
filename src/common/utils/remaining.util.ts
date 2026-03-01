import { Injectable } from '@nestjs/common';
import { MS } from './time.util';

interface RemainingResult {
	hour: number;
	minute: number;
	second: number;
}

@Injectable()
export class remainingTime {
	constructor(
		private _expiryDate: Date,
		private readonly _now: number = Date.now(),
	) {}

	static create(props: { expiryDate: Date }) {
		return new remainingTime(props.expiryDate);
	}

	calculateRemaining(): RemainingResult {
		const expired = this._expiryDate.getTime();
		const diff = expired - this._now;

		if (diff <= 0) return { hour: 0, minute: 0, second: 0 };

		return {
			hour: this.calculateHour(diff),
			minute: this.calculateMinute(diff),
			second: this.calculateSecond(diff),
		};
	}

	private calculateHour(diff: number): number {
		return Math.floor(diff / MS.HOUR);
	}

	private calculateMinute(diff: number) {
		return Math.floor((diff % MS.HOUR) / MS.MINUTE);
	}

	private calculateSecond(diff: number) {
		return Math.floor((diff % MS.MINUTE) / MS.SECOND);
	}
}
