import { IReservation } from "../api"

const minReservation: IReservation = {
	hour: new Date(2019, 10, 10),
	reservedAt: new Date(2019, 10, 10),
	reservedBy: {
		id: "bla",
		roleId: "R"
	},
	players: [
		{ id: "S1" },
		{ id: "S2" }
	],
	courtId: 1
}

export default minReservation
