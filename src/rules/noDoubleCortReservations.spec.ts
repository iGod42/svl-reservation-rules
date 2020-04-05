import { noDoubleCortReservations as srv } from "./noDoubleCortReservations"
import minReservation from "./MinReservation"

describe("no reservations on another court rule", () => {
	const basicDetails = {
		...minReservation,
		Stunde: new Date(2019, 10, 10)
	}

	const dummyReservation = {
		...basicDetails,
		PlatzID: 1,
		Reserviert_von: "rv",
		Spieler1: "s1",
		Spieler2: "s2"
	}

	it("returns falsely if all other people are used", () => {
		expect(
			srv(dummyReservation, [
				{
					...basicDetails,
					PlatzID: 2,
					Reserviert_von: "not_it",
					Spieler1: "also_not_it",
					Spieler2: "still not it"
				}
			])
		).toBeFalsy()
	})

	it("returns falsely if the same details are used, but at another time", () => {
		expect(
			srv(dummyReservation, [
				{
					...dummyReservation,
					PlatzID: 2,
					Stunde: new Date(2019, 10, 10, 10, 0, 0, 0)
				}
			])
		).toBeFalsy()
	})

	const testCombo = (src_field, tgt_field) => {
		it(`retruns message if same ${src_field} is used as ${tgt_field}`, () => {
			expect(
				typeof srv(dummyReservation, [
					{
						...basicDetails,
						[tgt_field]: dummyReservation[src_field],
						PlatzID: 2
					}
				])
			).toBe("string")
		})
	}

	testCombo("Reserviert_von", "Reserviert_von")
	testCombo("Reserviert_von", "Spieler1")
	testCombo("Reserviert_von", "Spieler2")

	testCombo("Spieler1", "Reserviert_von")
	testCombo("Spieler1", "Spieler1")
	testCombo("Spieler1", "Spieler2")

	testCombo("Spieler2", "Reserviert_von")
	testCombo("Spieler2", "Spieler1")
	testCombo("Spieler2", "Spieler2")
})
