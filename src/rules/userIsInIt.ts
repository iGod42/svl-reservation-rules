import { RuleEvaluation, RuleParser, RuleDefinition } from "./api"

const userIsInIt: RuleEvaluation = ({ reservation, userId }) =>
	!!userId &&
	reservation.reservedBy.id !== userId &&
	!reservation.players.find(player => player.id === userId)
		? `Benutzer ${userId} ist nicht in der Reservierung`
		: undefined

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "userIsInIt") {
		return userIsInIt
	}
}

export default parse
