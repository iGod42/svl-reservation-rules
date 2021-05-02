import srv from "./maxPerRange"

import { addDays } from "../tools"

import minReservation from "./MinReservation"
import { Reservation } from "./api"
import { MaxPerRangeDefinition } from "./api/MaxPerRangeDefinition"
import { ReservationInfo } from "evaluation/ReservationInfo"

const getDate = (hour: number, now = new Date()) => {
	return new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		hour,
		0,
		0,
		0
	)
}

const buildService = (definition: MaxPerRangeDefinition) => {
	const rule = srv(definition)
	if (!rule) throw new Error("invalid definition")

	return (
		reservation: Reservation,
		allReservations: Reservation[],
		now?: Date
	) => rule.evaluate({ reservation, allReservations, now })
}

describe("max per range Rule", () => {
	describe("single eval", () => {
		const aMonday = new Date(2019, 9, 14)
		describe("startAtReservationDay -> to simply check the daily count", () => {
			const theSrv = buildService({
				type: "maxPerRange",
				maximum: 1,
				limitForUser: false,
				startAtReservationDay: true
			})

			it("accepts any number > 0 if no reservations are passed", () => {
				expect(
					theSrv(
						{
							...minReservation,
							hour: new Date(aMonday)
						},
						[]
					)
				).toBeFalsy()
			})
			it("works if reservation is not within that range", () => {
				expect(
					theSrv(
						{
							...minReservation,
							hour: addDays(new Date(aMonday), 1)
						},
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							}
						]
					)
				).toBeFalsy()
			})
			it("fails if there are more reservations than limit on res day", () => {
				expect(
					typeof theSrv(
						{
							...minReservation,
							hour: new Date(aMonday)
						},
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							}
						]
					)
				).toBe("string")
			})
			it("accepts ignores reservations that are yesterday", () => {
				expect(
					theSrv({ ...minReservation, hour: new Date(aMonday) }, [
						{
							...minReservation,
							hour: addDays(new Date(aMonday), -1)
						}
					])
				).toBeFalsy()
			})
			it("accepts ignores reservations that are tomorrow", () => {
				expect(
					theSrv({ ...minReservation, hour: new Date(aMonday) }, [
						{
							...minReservation,
							hour: addDays(new Date(aMonday), 1)
						}
					])
				).toBeFalsy()
			})
		})

		describe("red rule max two for two days", () => {
			const theSrv = buildService({
				type: "maxPerRange",
				maximum: 2,
				dayRange: 2,
				limitForUser: false
			})

			it("works if there are no reservations", () => {
				expect(
					theSrv(
						{
							...minReservation,
							hour: new Date(aMonday)
						},
						[],
						aMonday
					)
				).toBeFalsy()
			})
			it("works if is one reservation today", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: new Date(aMonday) },
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
			it("fails if there are two reservation today", () => {
				expect(
					typeof theSrv(
						{
							...minReservation,
							hour: new Date(aMonday)
						},
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							},
							{ ...minReservation, hour: new Date(aMonday) }
						],
						aMonday
					)
				).toBe("string")
			})
			it("fails if there is a reservation today, and another tomorrow", () => {
				expect(
					typeof theSrv(
						{
							...minReservation,
							hour: new Date(aMonday)
						},
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							},
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 1)
							}
						],
						aMonday
					)
				).toBe("string")
			})
			it("ignores reservations after tomorrow", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: new Date(aMonday) },
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							},
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 2)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
			it("ignores reservations before today", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: new Date(aMonday) },
						[
							{
								...minReservation,
								hour: new Date(aMonday)
							},
							{
								...minReservation,
								hour: addDays(new Date(aMonday), -1)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
		})
		describe("red rule past 5", () => {
			const theSrv = buildService({
				type: "maxPerRange",
				maximum: 1,
				dayRange: 2,
				startAtHour: 17,
				limitForUser: false
			})
			it("works if there are no reservations", () => {
				expect(
					theSrv(
						{
							...minReservation,
							hour: getDate(18, aMonday)
						},
						[],
						aMonday
					)
				).toBeFalsy()
			})
			it("works if there are reservations before the hour", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: getDate(18, aMonday) },
						[
							{
								...minReservation,
								hour: getDate(14, aMonday)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
			it("fails if there are reservations after the hour", () => {
				expect(
					typeof theSrv(
						{
							...minReservation,
							hour: getDate(18, aMonday)
						},
						[
							{
								...minReservation,
								hour: getDate(17, aMonday)
							}
						],
						aMonday
					)
				).toBe("string")
			})
			it("works if there are reservations after the hour but outside of daterange", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: getDate(18, aMonday) },
						[
							{
								...minReservation,
								hour: addDays(getDate(14, aMonday), 1)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
			it("allows reservations tomorrow before 17:00 even if I have 2 at 17:00 today", () => {
				expect(
					theSrv(
						{
							...minReservation,
							hour: addDays(getDate(13, aMonday), 1)
						},
						[
							{
								...minReservation,
								hour: getDate(17, aMonday)
							},
							{ ...minReservation, hour: getDate(18, aMonday) }
						],
						aMonday
					)
				).toBeFalsy()
			})
		})

		describe("blueRule", () => {
			// today = monday
			const theSrv = buildService({
				type: "maxPerRange",
				maximum: 1,
				dayOffset: 2,
				dayRange: "EOW",
				limitForUser: false
			})
			it("fails if there is a reservation until the end of the week", () => {
				expect(
					typeof theSrv(
						{
							...minReservation,
							hour: new Date(2019, 9, 16)
						},
						[
							{
								...minReservation,
								hour: new Date(2019, 9, 17)
							}
						],
						new Date(2019, 9, 14)
					)
				).toBe("string")
			})
			it("works if there are only reservations before the offset", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: new Date(2019, 9, 16) },
						[
							{
								...minReservation,
								hour: new Date(2019, 9, 15)
							}
						],
						new Date(2019, 9, 14)
					)
				).toBeFalsy()
			})
			it("works if there are only reservations after this week", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: new Date(2019, 9, 16) },
						[
							{
								...minReservation,
								hour: new Date(2019, 9, 21)
							}
						],
						new Date(2019, 9, 14)
					)
				)
			})

			describe("user filter", () => {
				const theSrv = buildService({
					type: "maxPerRange",
					maximum: 1
				})
				const date = new Date()
				it("considers reservations where the same user is a part of", () => {
					expect(
						typeof theSrv(
							{
								...minReservation,
								hour: date,
								reservedBy: { id: "a" }
							},
							[
								{
									...minReservation,
									hour: date,
									players: [{ id: "a" }]
								}
							]
						)
					).toBe("string")
				})
				it("ignores reservations where none of the same users are present", () => {
					expect(
						theSrv(
							{
								...minReservation,
								hour: date,
								reservedBy: { id: "a" },
								players: [{ id: "b1" }, { id: "b2" }]
							},
							[
								{
									...minReservation,
									hour: date,
									players: [{ id: "c1" }, { id: "c2" }]
								}
							]
						)
					).toBeFalsy()
				})
			})
		})

		describe("max 2 per week starting next week", () => {
			const theSrv = buildService({
				type: "maxPerRange",
				maximum: 2,
				dayOffset: "SOW",
				dayRange: 7,
				offsetStart: "start-of-next-week",
				limitForUser: false,
				startAtReservationDay: true
			})
			it("is ignored for the current week", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: addDays(new Date(aMonday), 2) },
						[
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 1)
							},
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 0)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
			it("allows 2 per week starting next week", () => {
				expect(
					theSrv(
						{ ...minReservation, hour: addDays(new Date(aMonday), 9) },
						[
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 8)
							}
						],
						aMonday
					)
				).toBeFalsy()
			})
			it("rejects more than 2 next week", () => {
				expect(
					typeof theSrv(
						{ ...minReservation, hour: addDays(new Date(aMonday), 9) },
						[
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 8)
							},
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 7)
							}
						],
						aMonday
					)
				).toBe("string")
			})
			it("rejects more than 2 the week after next week", () => {
				expect(
					typeof theSrv(
						{ ...minReservation, hour: addDays(new Date(aMonday), 16) },
						[
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 15)
							},
							{
								...minReservation,
								hour: addDays(new Date(aMonday), 14)
							}
						],
						aMonday
					)
				).toBe("string")
			})
		})
	})
	describe("bulk eval", () => {
		describe("static", () => {
			const rule = srv({
				type: "maxPerRange",
				maximum: 1,
				startAtReservationDay: false,
				limitForUser: false,
				dayRange: 1
			})
			it("ignores everything that is not covered by rule", () => {
				const okRi: ReservationInfo = {
					hour: new Date(2020, 0, 2),
					courtId: 1
				}
				rule?.evaluateBulk({
					reservationsInfo: [okRi],
					allReservations: [
						{
							...minReservation,
							courtId: 1,
							hour: new Date(2020, 0, 1)
						}
					],
					now: new Date(2020, 0, 1)
				})
				expect(okRi.violation).toBeUndefined()
			})
			it("set's validation errors if rule is violated", () => {
				const ri: ReservationInfo = {
					hour: new Date(2020, 0, 2),
					courtId: 1
				}
				rule?.evaluateBulk({
					reservationsInfo: [ri],
					allReservations: [
						{
							...minReservation,
							courtId: 1,
							hour: new Date(2020, 0, 2)
						}
					],
					now: new Date(2020, 0, 2)
				})

				expect(typeof ri.violation).toBe("string")
			})
			it("doesn't set violation errors for areas that are not violated", () => {
				const okRi: ReservationInfo = {
					hour: new Date(2020, 0, 1),
					courtId: 1
				}
				const ri: ReservationInfo = {
					hour: new Date(2020, 0, 2),
					courtId: 1
				}
				rule?.evaluateBulk({
					reservationsInfo: [okRi, ri],
					allReservations: [
						{
							...minReservation,
							courtId: 1,
							hour: new Date(2020, 0, 2)
						}
					],
					now: new Date(2020, 0, 2)
				})
				expect(okRi.violation).toBeUndefined()
			})
		})
		describe("dynamic", () => {
			const rule = srv({
				type: "maxPerRange",
				maximum: 1,
				startAtReservationDay: true,
				limitForUser: false,
				dayRange: 1
			})

			it("set's validation errors if rule is violated", () => {
				const ri: ReservationInfo = {
					hour: new Date(2020, 0, 2),
					courtId: 1
				}
				rule?.evaluateBulk({
					reservationsInfo: [ri],
					allReservations: [
						{
							...minReservation,
							courtId: 1,
							hour: new Date(2020, 0, 2)
						}
					]
				})

				expect(typeof ri.violation).toBe("string")
			})
			it("doesn't set violation errors for areas that are not violated", () => {
				const okRi: ReservationInfo = {
					hour: new Date(2020, 0, 1),
					courtId: 1
				}
				const ri: ReservationInfo = {
					hour: new Date(2020, 0, 2),
					courtId: 1
				}
				rule?.evaluateBulk({
					reservationsInfo: [okRi, ri],
					allReservations: [
						{
							...minReservation,
							courtId: 1,
							hour: new Date(2020, 0, 2)
						}
					]
				})
				expect(okRi.violation).toBeUndefined()
			})
		})
	})
})
