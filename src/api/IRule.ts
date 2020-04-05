import { IReservation } from "api/IReservation"
import { IUser } from "api/IUser"

export interface IRule {
	(reservation: IReservation, allReservations?: IReservation[], user?: IUser):
		| string
		| false
}
