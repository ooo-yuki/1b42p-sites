// Узоры тем: день, ночь, тревога. Только местные синты, без bank/gm_/samples.
// Строки править на слух в Task 5.

export const SONG_CPM = { day: 34, night: 24, alarm: 46 };
export const SONG_DAY =
  "stack(note('<[a2 a2] [d3 d3] [e3 e3] [a2 a2]>').sound('sawtooth').lpf(1200).vib(4).gain(.5)," +
  "note('<[a4 c5 e5 a5] [d5 f5 a5 d6] [e5 g5 b5 e6] [a4 c5 e5 a5]>*2').sound('square').lpf(2500).gain(.22).delay(.3).room(.4)," +
  "note('c2*4').sound('sine').gain(.7)," +
  "sound('white*8').decay(.04).gain(.25)).cpm(34).play()";
export const SONG_NIGHT =
  "stack(note('[a3 ~ e4 ~] [~ d4 ~ c4]').sound('triangle').delay(.5).room(.8).gain(.4)," +
  "note('a1*2').sound('sine').gain(.5)).cpm(24).play()";
export const SONG_ALARM =
  "stack(note('[a2 a2 a2 a2]*4').sound('sawtooth').lpf(2000).gain(.5)," +
  "sound('white*16').decay(.03).gain(.3)).cpm(46).play()";
