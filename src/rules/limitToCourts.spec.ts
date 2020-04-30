import limitToCourts from "./limitToCourts"
import minReservation from "./MinReservation"
import { Reservation } from "./api"
import { ReservationInfo } from "evaluation/ReservationInfo"

const getDate = (hour: number, minute = 0) => {
	const now = new Date()
	return new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		hour,
		minute,
		0,
		0
	)
}

describe("limitToCourts", () => {
	describe("eval", () => {
		describe("with only court constraint", () => {
			const rule = limitToCourts({ type: "limitToCourts", courtIds: [1, 2] })
			if (!rule) throw new Error("parsing failed")

			const theSrv = (reservation: Reservation) =>
				rule.evaluate({ reservation })

			it("allows reservations for the first court in the list", () => {
				expect(
					theSrv({
						...minReservation,
						courtId: 1,
						hour: new Date()
					})
				).toBeUndefined()
			})
			it("allows reservations for the second court in the list", () => {
				expect(
					theSrv({
						...minReservation,
						courtId: 2,
						hour: new Date()
					})
				).toBeUndefined()
			})
			it("doesn't allow all courts that are not listed", () => {
				expect(
					typeof theSrv({
						...minReservation,
						courtId: 3333,
						hour: new Date()
					})
				).toBe("string")
			})
		})

		describe("cutoff time is given", () => {
			const cutoffTime = 17
			const rule = limitToCourts({
				type: "limitToCourts",
				courtIds: [2],
				afterHour: cutoffTime
			})
			if (!rule) throw new Error("parsing failed")
			const theSrv = (reservation: Reservation) =>
				rule.evaluate({ reservation })

			it("rejects at exactly cutoff time ", () => {
				expect(
					typeof theSrv({
						...minReservation,
						courtId: 1,
						hour: getDate(cutoffTime)
					})
				).toBe("string")
			})
			it("rejects after cutoff time ", () => {
				expect(
					typeof theSrv({
						...minReservation,
						courtId: 1,
						hour: getDate(cutoffTime + 1)
					})
				).toBe("string")
			})
			it("accepts before cutoff time", () => {
				expect(
					theSrv({
						...minReservation,
						courtId: 1,
						hour: getDate(cutoffTime - 1)
					})
				).toBeFalsy()
			})
		})

		describe("when weekday is given", () => {
			const rule = limitToCourts({
				type: "limitToCourts",
				courtIds: [2],
				weekDays: [1]
			})
			if (!rule) throw new Error("parsing failed")
			const theSrv = (reservation: Reservation) =>
				rule.evaluate({ reservation })

			const exampleMonday = new Date(2020, 0, 13) // day 1
			const exampleTuesday = new Date(2020, 0, 14) // day 2
			it("accepts reservations on days listed", () => {
				expect(
					theSrv({
						...minReservation,
						courtId: 2,
						hour: exampleTuesday
					})
				).toBeFalsy()
			})
			it("rejects reservations on days not listed", () => {
				expect(
					typeof theSrv({
						...minReservation,
						courtId: 1,
						hour: exampleMonday
					})
				).toBe("string")
			})
		})
	})
	describe("bulk", () => {
		const rule = limitToCourts({ type: "limitToCourts", courtIds: [1, 2] })
		it("set's violation for violated", () => {
			const okRi: ReservationInfo = {
				courtId: 1,
				hour: new Date()
			}
			const errorRi: ReservationInfo = {
				courtId: 3,
				hour: new Date()
			}
			rule?.evaluateBulk({
				reservationsInfo: [okRi, errorRi]
			})

			expect(okRi.violation).toBeUndefined()
			expect(typeof errorRi.violation).toBe("string")
		})
	})
})
