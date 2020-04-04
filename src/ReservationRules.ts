import {IReservation, IRole, IUser} from "./api"
import {getBeginningOfWeek, addDays} from "./tools"
import roles from "./roles"

export interface IReservationProvider {
	(from: Date, to: Date): Promise<IReservation[]>
}

export class ReservationRules {
	
	private readonly _reservationProvider: IReservationProvider
	
	constructor(reservationProvider: IReservationProvider) {
		this._reservationProvider = reservationProvider
	}
	
	canCancel(user: IUser, delReservation: IReservation): Promise<Array<string | false>> {
		const userRole: IRole = roles[user.RolleID]
		
		const rules = userRole?.reservationCancellationRules || [(_reservation) => false]
		
		return Promise.resolve(rules.map(rule => rule(delReservation, undefined, user))
			.filter(a => a) // remove null values
		)
	}
	
	canReserve(user: IUser, reservation: IReservation) {
		const userRole = roles[user.RolleID]
		const monday = getBeginningOfWeek(new Date())
		
		// this'd have to be adapted to validate more than the green red rules, but should be good enough for now
		return this._reservationProvider(monday, addDays(monday, 14))
			.then(reservations =>
				userRole.reservationCreationRules.map(rule => rule(reservation, reservations, user))
					.filter(a => a)
			)
	}
}