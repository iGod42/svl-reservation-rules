import { ensureOpeningHours, noOtherReservations } from "../../rules"
import { IRule } from "../../api"

export const generalRules: IRule[] = [ensureOpeningHours, noOtherReservations]
