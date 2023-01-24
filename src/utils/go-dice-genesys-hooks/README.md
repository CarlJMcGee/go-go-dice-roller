# Go Dice API Genesys Plugin Hooks

This is an addon for the [Go Dice API Wrapper](https://github.com/Zeragamba/go-dice-js/tree/main/packages/go-dice-api) and [React hooks](https://github.com/Zeragamba/go-dice-js/tree/main/packages/go-dice-react) packages maintained by [Zeragamba](https://github.com/Zeragamba) and [myself](https://github.com/CarlJMcGee) adding support for Genesys dice types.

Genesys is a generic version of Fantasy Flight's Edge of the Empire game utilizing symbol based dice values:

- Success
- Triumph (critical success)
- Advantage
- Failure
- Despair (critical failure)
- Threat
  Successes and failures cancel each other out to determine the roll's success, while advantage and threat cancel each other to determine potential side effects separate to the intended roll outcome.

This package contains two hooks:

- ## useGenesysDie

This replaces the useDieValue hook, listens for the die's "value" event and returns an array of genesys die face values, e.g. \["success", "advantage"\], \["triumph"\], \["failure", "threat"\].

- ## useGenesysResults

This returns an object containing a variety of state and setState functions used to calculate the final result of the dice pool.

- success: a number representing the net successes of the roll
- triumph: a number representing the net triumphs of the roll
- advantage: a number representing the net advantages of the roll
- rolled: a boolean to record whether the user had rolled or not
- setRolled: sets rolled state
- outcome: a string containing the successfulness of the roll, e.g. "Success" or "Failure"
- sideEffects: a string containing the nature of the side effects, e.g. "Advantage" or "Disadvantage"
- crit: a string containing the nature of the crit, e.g. "Triumphant" or "Despairing"
- inputResult: this function take the array of values returned by useGenesysDie and will increment or decrement the appropriate state for each value.
- resetResults: this function resets all states to 0
