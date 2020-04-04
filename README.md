# SVL Tennis reservation rules

To consolidate the rather complex rule checking for back and frontend.

## Usage

```typescript
import {ReservationRules} from 'reservation-rules'

/* some rules need to know about other reservations
 * so the rules need a possibility to query for those 
*/
const queryReservations = (fromDate: Date, toDate: Date) => [/*The reservations*/] 

const resRules = new ReservationRules(queryReservations)

// checking:
resRules.canCancel(user, reservation)
resRules.canReserve(user, reservation)
```

Both methods return an array of error messages for broken rules.
If the array is empty all is good