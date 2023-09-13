/* eslint-disable no-unused-vars */
const originalFeatures = [
  {
    label: 'England/Wales',
    coloured: 'Yellow',
    bpm: 112
  },
  {
    label: 'Ice/England',
    coloured: 'None',
    bpm: 119
  },
  {
    label: 'Wales/Ireland',
    coloured: 'None',
    bpm: 111
  },
  {
    label: 'England/Ireland',
    coloured: 'None',
    bpm: 108
  },
  {
    label: 'Ireland/England',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Ireland/Wales',
    coloured: 'None',
    bpm: 104
  },
  {
    label: 'Scotland/England',
    coloured: 'None',
    bpm: 115
  },
  {
    label: 'Wales/Ireland',
    coloured: 'None',
    bpm: 109
  },
  {
    label: 'Ireland/Ireland',
    coloured: 'None',
    bpm: 117
  },
  {
    label: 'Wales/Ireland',
    coloured: 'None',
    bpm: 100
  },
  {
    label: 'Vapor/Ice',
    coloured: 'None',
    bpm: 125
  },
  {
    label: 'Scotland/Ireland',
    coloured: 'None',
    bpm: 101
  },
  {
    label: 'England/Desolate',
    coloured: 'None',
    bpm: 120
  },
  {
    label: 'Ireland/Desolate',
    coloured: 'Magenta',
    bpm: 118
  },
  {
    label: 'Scotland/England',
    coloured: 'None',
    bpm: 122
  },
  {
    label: 'Ireland/Wales',
    coloured: 'None',
    bpm: 116
  },
  {
    label: 'England/England',
    coloured: 'None',
    bpm: 112
  },
  {
    label: 'Scotland/England',
    coloured: 'None',
    bpm: 112
  },
  {
    label: 'Scotland/Wales',
    coloured: 'None',
    bpm: 104
  },
  {
    label: 'Ireland/Vapor',
    coloured: 'None',
    bpm: 111
  },
  {
    label: 'Wales/Scotland',
    coloured: 'None',
    bpm: 113
  },
  {
    label: 'Scotland/Scotland',
    coloured: 'Magenta',
    bpm: 109
  },
  {
    label: 'Ireland/Wales',
    coloured: 'None',
    bpm: 100
  },
  {
    label: 'Scotland/Scotland',
    coloured: 'None',
    bpm: 129
  },
  {
    label: 'England/Scotland',
    coloured: 'None',
    bpm: 100
  },
  {
    label: 'Desolate/England',
    coloured: 'Magenta',
    bpm: 114
  },
  {
    label: 'England/Scotland',
    coloured: 'None',
    bpm: 102
  },
  {
    label: 'Ireland/Ice',
    coloured: 'None',
    bpm: 123
  },
  {
    label: 'England/Ireland',
    coloured: 'None',
    bpm: 103
  },
  {
    label: 'Ireland/Vapor',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Ireland/Scotland',
    coloured: 'None',
    bpm: 107
  },
  {
    label: 'Desolate/Ireland',
    coloured: 'None',
    bpm: 125
  },
  {
    label: 'Scotland/Wales',
    coloured: 'None',
    bpm: 108
  },
  {
    label: 'Wales/England',
    coloured: 'Magenta',
    bpm: 113
  },
  {
    label: 'Desolate/Wales',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Scotland/England',
    coloured: 'None',
    bpm: 128
  },
  {
    label: 'Wales/Ireland',
    coloured: 'None',
    bpm: 115
  },
  {
    label: 'England/England',
    coloured: 'None',
    bpm: 105
  },
  {
    label: 'Ice/Scotland',
    coloured: 'None',
    bpm: 126
  },
  {
    label: 'Wales/Ireland',
    coloured: 'None',
    bpm: 102
  },
  {
    label: 'Ireland/Scotland',
    coloured: 'None',
    bpm: 120
  },
  {
    label: 'England/Wales',
    coloured: 'None',
    bpm: 105
  },
  {
    label: 'Scotland/England',
    coloured: 'None',
    bpm: 102
  },
  {
    label: 'Scotland/Wales',
    coloured: 'Magenta',
    bpm: 114
  },
  {
    label: 'Ice/Ireland',
    coloured: 'None',
    bpm: 123
  },
  {
    label: 'Desolate/England',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Wales/Wales',
    coloured: 'None',
    bpm: 107
  },
  {
    label: 'Ireland/Ireland',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Ireland/Wales',
    coloured: 'None',
    bpm: 111
  },
  {
    label: 'England/Ireland',
    coloured: 'None',
    bpm: 102
  },
  {
    label: 'Scotland/Scotland',
    coloured: 'None',
    bpm: 124
  },
  {
    label: 'Scotland/Scotland',
    coloured: 'None',
    bpm: 100
  },
  {
    label: 'Desolate/Desolate',
    coloured: 'None',
    bpm: 119
  },
  {
    label: 'Scotland/England',
    coloured: 'None',
    bpm: 101
  },
  {
    label: 'Ireland/Ice',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Scotland/Scotland',
    coloured: 'None',
    bpm: 114
  },
  {
    label: 'Scotland/Ireland',
    coloured: 'None',
    bpm: 100
  },
  {
    label: 'Wales/Scotland',
    coloured: 'None',
    bpm: 116
  },
  {
    label: 'England/England',
    coloured: 'None',
    bpm: 122
  },
  {
    label: 'Wales/Ireland',
    coloured: 'None',
    bpm: 129
  },
  {
    label: 'England/Wales',
    coloured: 'None',
    bpm: 126
  },
  {
    label: 'Ireland/Wales',
    coloured: 'None',
    bpm: 121
  },
  {
    label: 'Wales/Wales',
    coloured: 'None',
    bpm: 111
  },
  {
    label: 'Desolate/Wales',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Desolate/Ice',
    coloured: 'None',
    bpm: 114
  },
  {
    label: 'Ireland/Ireland',
    coloured: 'None',
    bpm: 103
  },
  {
    label: 'England/Ireland',
    coloured: 'Cyan',
    bpm: 105
  },
  {
    label: 'Wales/Wales',
    coloured: 'None',
    bpm: 125
  },
  {
    label: 'Wales/Scotland',
    coloured: 'None',
    bpm: 121
  },
  {
    label: 'Scotland/Ireland',
    coloured: 'None',
    bpm: 122
  },
  {
    label: 'England/England',
    coloured: 'None',
    bpm: 116
  },
  {
    label: 'Ireland/Wales',
    coloured: 'Cyan',
    bpm: 122
  },
  {
    label: 'Ireland/Vapor',
    coloured: 'None',
    bpm: 100
  },
  {
    label: 'Desolate/Ireland',
    coloured: 'None',
    bpm: 103
  },
  {
    label: 'Desolate/Scotland',
    coloured: 'None',
    bpm: 126
  },
  {
    label: 'Wales/Vapor',
    coloured: 'None',
    bpm: 110
  },
  {
    label: 'Scotland/Scotland',
    coloured: 'None',
    bpm: 128
  },
  {
    label: 'Wales/England',
    coloured: 'None',
    bpm: 105
  }
]
