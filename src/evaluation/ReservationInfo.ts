import { Reservation } from "../rules/api";

export interface ReservationInfo {
    hour: Date,
    courtId: number,
    reservation?: Reservation,
    violation?: string,
}