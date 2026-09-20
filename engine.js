/* gate-lab engine: digital logic gates + 3-gate circuit evaluation */
var GATES = {
  AND:  { label:'AND',  fn:function(a,b){ return a&&b; } },
  OR:   { label:'OR',   fn:function(a,b){ return a||b; } },
  XOR:  { label:'XOR',  fn:function(a,b){ return (a?1:0)^(b?1:0) ? true:false; } },
  NAND: { label:'NAND', fn:function(a,b){ return !(a&&b); } },
  NOR:  { label:'NOR',  fn:function(a,b){ return !(a||b); } },
  XNOR: { label:'XNOR', fn:function(a,b){ return !((a?1:0)^(b?1:0)); } }
};
var GATE_NAMES = Object.keys(GATES);

/* circuit: g1=gate1(A,B), g2=gate2(B,C), out=gate3(g1,g2) */
function evalGate(type, a, b){ return GATES[type].fn(!!a, !!b); }
function evalCircuit(types, inputs){
  var g1 = evalGate(types[0], inputs[0], inputs[1]);
  var g2 = evalGate(types[1], inputs[1], inputs[2]);
  var out = evalGate(types[2], g1, g2);
  return { g1:g1, g2:g2, out:out };
}
/* challenge: random types/inputs, hide slot; correct answer = any type reproducing target out */
function makeChallenge(rng){
  rng = rng || Math.random;
  for (var tries=0; tries<30; tries++){
    var types = [0,1,2].map(function(){ return GATE_NAMES[Math.floor(rng()*GATE_NAMES.length)]; });
    var inputs = [0,1,2].map(function(){ return rng() < 0.5; });
    var slot = Math.floor(rng()*3);
    var target = evalCircuit(types, inputs).out;
    var accepts = GATE_NAMES.filter(function(t){
      var trial = types.slice(); trial[slot] = t;
      return evalCircuit(trial, inputs).out === target;
    });
    if (accepts.length <= 3) return { types:types, inputs:inputs, slot:slot, target:target, accepts:accepts };
  }
  return { types:types, inputs:inputs, slot:slot, target:target, accepts:accepts };
}
function answerCorrect(ch, guess){ return ch.accepts.indexOf(guess) !== -1; }

if (typeof module !== 'undefined' && module.exports){
  module.exports = { GATES:GATES, GATE_NAMES:GATE_NAMES, evalGate:evalGate, evalCircuit:evalCircuit, makeChallenge:makeChallenge, answerCorrect:answerCorrect };
}
