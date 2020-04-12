import { IReservation } from "../api"

const minReservation: IReservation = {
	hour: new Date(2019, 10, 10),
	reservedBy: "bla",
	players: ["S1", "S2"],
	courtId: 1
}

export default minReservation
