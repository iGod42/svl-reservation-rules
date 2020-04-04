import {noOtherReservations as srv} from "./noOtherReservations"
import {IReservation} from "api"
import minReservation from "./MinReservation"

describe("opening hours rule", () => {
	
	const reservationDummy: IReservation = {...minReservation, Stunde: new Date(2019, 10, 10), PlatzID: 1}
	
	it("returns a message if there's a reservation at the same time and court", () => {
		expect(typeof srv(reservationDummy, [reservationDummy])).toBe("string")
	})
	it("returns falsely if a reservation is defined at the same time but another court", () => {
		expect(srv(reservationDummy, [{...reservationDummy, PlatzID: 3}])).toBeFalsy()
	})
	it("returns falsely if a reservation is defined at the same court but another time", () => {
		expect(srv(reservationDummy, [{...reservationDummy, Stunde: new Date(2019, 10, 10, 1, 0, 0, 0)}])).toBeFalsy()
	})
	it("returns falsely if no other reservation is defined", () => {
		expect(srv(reservationDummy, [])).toBeFalsy()
	})
	it("throws if no param for existing reservations is passed", () => {
		expect(() => srv(reservationDummy)).toThrow()
	})
})
