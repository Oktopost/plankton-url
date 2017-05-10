'use strict';


const Namespace = require('oktopost-namespace');


const container = {
	Plankton: 	require('oktopost-plankton')
};
const Plankton = new Namespace(container);


module.exports = {
	Plankton: container.Plankton,
	namespace: Plankton.getCreator()
};