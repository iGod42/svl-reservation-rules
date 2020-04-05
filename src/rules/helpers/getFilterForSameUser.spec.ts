import { getFilterForSameUser as srv } from "./getFilterForSameUser"
import minReservation from "../MinReservation"

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

describe("getFilterForSameUser", () => {
	const testCombo = (src_field, tgt_field) => {
		it(`returns true if same ${src_field} is used as ${tgt_field}`, () => {
			expect(
				srv(dummyReservation)({
					...basicDetails,
					[tgt_field]: dummyReservation[src_field],
					PlatzID: 2
				})
			).toBeTruthy()
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
