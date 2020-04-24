import limitToCourts from "./limitToCourts"
import minReservation from "./MinReservation"
import { Reservation } from "./api"

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
	describe("rule", () => {
		describe("with only court constraint", () => {
			const rule = limitToCourts({ type: "limitToCourts", courtIds: [1, 2] })
			if (!rule) throw new Error("parsing failed")

			const theSrv = (reservation: Reservation) => rule({ reservation })

			it("doesn't allow reservations for the first court in the list", () => {
				expect(
					typeof theSrv({
						...minReservation,
						courtId: 1,
						hour: new Date()
					})
				).toBe("string")
			})
			it("doesn't allow reservations for the second court in the list", () => {
				expect(
					typeof theSrv({
						...minReservation,
						courtId: 2,
						hour: new Date()
					})
				).toBe("string")
			})
			it("allows all courts that are not listed", () => {
				expect(
					theSrv({
						...minReservation,
						courtId: 3333,
						hour: new Date()
					})
				).toBeFalsy()
			})
		})

		describe("cutoff time is given", () => {
			const cutoffTime = 17
			const rule = limitToCourts({
				type: "limitToCourts",
				courtIds: [1],
				afterHour: cutoffTime
			})
			if (!rule) throw new Error("parsing failed")
			const theSrv = (reservation: Reservation) => rule({ reservation })

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
				courtIds: [1],
				weekDays: [1]
			})
			if (!rule) throw new Error("parsing failed")
			const theSrv = (reservation: Reservation) => rule({ reservation })

			const exampleMonday = new Date(2020, 0, 13) // day 1
			const exampleTuesday = new Date(2020, 0, 14) // day 2
			it("accepts reservations on days not listed", () => {
				expect(
					theSrv({
						...minReservation,
						courtId: 1,
						hour: exampleTuesday
					})
				).toBeFalsy()
			})
			it("rejects reservations on days listed", () => {
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
})
