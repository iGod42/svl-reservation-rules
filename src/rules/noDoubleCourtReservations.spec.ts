import noDoubleCourtReservations from "./noDoubleCourtReservations"
import minReservation from "./MinReservation"
import { Reservation } from "./api"
import { ReservationInfo } from "evaluation/ReservationInfo"

describe("no reservations on another court rule", () => {
	const basicDetails = {
		...minReservation,
		hour: new Date(2019, 10, 10)
	}

	const dummyReservation: Reservation = {
		...basicDetails,
		courtId: 1,
		reservedBy: { id: "rv" },
		players: [{ id: "s1" }, { id: "s2" }]
	}

	const rule = noDoubleCourtReservations({ type: "noDoubleCourtReservation" })

	if (!rule) throw new Error("invalid definition")
	describe("single", () => {
		const srv = (reservation: Reservation, allReservations: Reservation[]) =>
			rule.evaluate({ reservation, allReservations })

		it("returns falsely if all other people are used", () => {
			expect(
				srv(dummyReservation, [
					{
						...basicDetails,
						courtId: 2,
						reservedBy: { id: "not_it" },
						players: [{ id: "also_not_it" }, { id: "not" }]
					}
				])
			).toBeFalsy()
		})

		it("returns falsely if the same details are used, but at another time", () => {
			expect(
				srv(dummyReservation, [
					{
						...dummyReservation,
						courtId: 2,
						hour: new Date(2019, 10, 10, 10, 0, 0, 0)
					}
				])
			).toBeFalsy()
		})

		describe('max 2', () => {

			const max2 = noDoubleCourtReservations({ type: "noDoubleCourtReservation", maxCourts: 2 })
			it('allows one other reservation', () => {
				expect(
					max2?.evaluate({
						reservation: dummyReservation, allReservations: [
							{
								...dummyReservation,
								courtId: 2
							}
						]
					})
				).toBeFalsy()
			})
			it('does not allow two other reservations', () => {
				expect(
					typeof max2?.evaluate({
						reservation: dummyReservation, allReservations: [
							{
								...dummyReservation,
								courtId: 2
							},
							{
								...dummyReservation,
								courtId: 3
							}
						]
					})
				).toBe('string')
			})
		})
	})

	describe("bulk", () => {
		const hour = new Date(2020, 0, 1, 10)
		const okRi: ReservationInfo = {
			courtId: 1,
			hour: new Date(2020, 0, 1, 12)
		}
		const notOkRi: ReservationInfo = {
			courtId: 1,
			hour: hour
		}
		const userId = "dummy"

		rule.evaluateBulk({
			reservationsInfo: [okRi, notOkRi],
			allReservations: [
				{
					courtId: 3,
					hour: hour,
					players: [],
					reservedBy: { id: userId }
				}
			],
			userId
		})
		it("sets message to doubly reserved", () => {
			expect(typeof notOkRi.violation).toBe("string")
		})
		it("doesn't set on ok info", () => {
			expect(okRi.violation).toBeUndefined()
		})
	})
})
