# Labs

Disclaimer: this is still WIP. Any help is welcome!

This simple set of js scripts can help you to write your Latex Lab Report.  

They are very simple to use. Just load all files in a js enviroment, and use the following commands to setup:

	// Create a new env
	env = new Env({
		n: ['N'],
		x: ['x', 'm'],
		mu: ['\\mu', 'm', 'x * n']
		// name: [ latex_name, unit, formula_if_derived ]
	});

	// Add values for variable n
	env.add('n', ['1', '2', '3'], '0.5');

	env.add('x', [
		['1', '0.1'],
		['2', 'n', '0.02'],
		'3'
	]);

	/*
	 * env.add(variable, [ ..., [ value, multiplier, error ], ... ], default_multiplier, default_error);
	 */

	// Display the table (return the table Latex as string)
	env.latexTable(['n', 'x', 'f']);
