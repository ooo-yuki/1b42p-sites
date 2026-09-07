// Узоры тем: день, ночь, тревога. Только местные синты, без bank/gm_/samples.
// День: шагающий низ восьмыми, аккордовая подушка с мягкой атакой,
// мелодия с ответом октавой выше, живые верха с перебивками,
// дыр длиннее доли нет, глубина delay/room.
// Ночь: низкий гул-подушка, редкая мелодия с долгим эхом,
// мягкий пульс, редкие высокие искры.
// Тревога: фразы вопросом-ответом, прыжки октавой,
// каждый четвёртый круг полутемп, низкий пульс и шумовые акценты,
// стена одинаковых ударов запрещена.

export const SONG_CPM = { day: 34, night: 24, alarm: 46 };
export const SONG_DAY =
  "stack(note('<[a2 b2] [c3 d3] [e3 g2] [a2 e2]>*2').sound('sawtooth').lpf(900).gain(.5)," +
  "note('<[a3 c4 e4] [d4 f4 a4] [e4 g4 b4] [a3 c4 e4]>').sound('triangle').attack(.4).lpf(1800).gain(.3).delay(.25).room(.5)," +
  "note('<[a4 c5 e5 a5] [g5 e5 d5 c5] [a5 c6 e6 a6] [g6 e6 d6 c6]>').sound('square').lpf(2500).gain(.26).delay(.3).room(.4)," +
  "sound('<white*8 white*8 white*8 white*16>').decay(.04).gain(.2)," +
  "note('<[e6 ~ g6 ~] [a6 ~ g6 e6]>*2').sound('sine').gain(.14).delay(.3).room(.4)," +
  "note('a1*4').sound('sine').gain(.55)).cpm(" + SONG_CPM.day + ").play()";
export const SONG_NIGHT =
  "stack(note('<a1 e2 a2>').sound('sine').attack(.8).gain(.5).room(.8)," +
  "note('[~ e4 ~ ~] [~ ~ a4 ~] [~ d4 ~ ~] [~ ~ c4 ~]').sound('triangle').delay(.6).room(.9).gain(.32)," +
  "note('<a1 ~ c2 ~>').sound('triangle').lpf(400).gain(.3)," +
  "note('e6*8').degradeBy(.8).sound('sine').delay(.5).room(.8).gain(.2)).cpm(" + SONG_CPM.night + ").play()";
export const SONG_ALARM =
  "stack(note('<[e3 g3 a3 c4] ~ [d3 f3 a3 d4] ~>').sound('sawtooth').lpf(2200).gain(.45)," +
  "note('<~ [e4 g4 a4 e5] ~ [d4 f4 a4 d5]>').sound('square').lpf(2600).gain(.33).delay(.25).room(.3)," +
  "note('<[a2 a2 c3 c3] [d3 d3 e3 e3] [f3 f3 g3 g3] [a2 c3 e3 a3]>').slow('<1 1 1 2>').sound('sawtooth').lpf(1000).gain(.5)," +
  "note('a1*4').sound('sine').gain(.6)," +
  "sound('<white*4 ~ white*2 ~>').decay(.05).gain(.3)).cpm(" + SONG_CPM.alarm + ").play()";
