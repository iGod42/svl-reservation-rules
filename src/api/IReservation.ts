export interface IReservation {
	hour: Date;
	courtId: number;
	reservedBy: {
		id: string;
		roleId: string;
		firstName?: string;
		lastName?: string;
	};
	reservedAt: Date;
	description?: string;
	players: {
		id: string;
		firstName?: string;
		lastName?: string;
		playedWithMe?: number;
	}[];
}
