export const TAGS_DATA_NESTED = [{
  id: '1',
  name: 'Ahsan',
  designation: 'Senior engineer',
  subOrdinatesCount: 3,
  subOrdinates: [{
    id: '1.1',
    name: 'Ali',
    parentId: '1',
    designation: 'Software engineer',
    subOrdinatesCount: 2,
    subOrdinates: [{
      parentId: '1.1',
      id: '1.1.1',
      name: 'Some user 1',
      subOrdinatesCount: 0,
      designation: 'Software engineer'
    }, {
      id: '1.1.2',
      parentId: '1.1',
      subOrdinatesCount: 0,
      name: 'Some user 2',
      designation: 'Software engineer'
    }]
  }, {
    id: '1.2',
    parentId: '1',
    name: 'Asghar',
    subOrdinatesCount: 0,
    designation: 'Software engineer'
  }]
}, {
  id: '2',
  name: 'Saad',
  designation: 'Software engineer',
  subOrdinatesCount: 2,
  subOrdinates: [{
    id: '2.1',
    name: 'Zuhair',
    parentId: '2',
    designation: 'Software engineer',
    subOrdinatesCount: 2,
    subOrdinates: [{
      parentId: '2.1',
      id: '2.1.1',
      subOrdinatesCount: 0,
      name: 'Yawar',
      designation: 'Software engineer'
    }, {
      parentId: '2.1',
      id: '2.1.2',
      name: 'Abbas',
      subOrdinatesCount: 0,
      designation: 'Software engineer'
    }]
  }, {
    id: '2.2',
    parentId: '2',
    name: 'Mehdi',
    designation: 'Software engineer',
    subOrdinatesCount: 2,
    subOrdinates: [{
      id: '2.2.1',
      parentId: '2.2',
      name: 'Zainab',
      subOrdinatesCount: 0,
      designation: 'Software engineer'
    }, {
      id: '2.2.2',
      parentId: '2.2',
      subOrdinatesCount: 0,
      name: 'Salim',
      designation: 'Software engineer'
    }]
  }]
}, {
  id: '3',
  name: 'Mohsin',
  subOrdinatesCount: 0,
  designation: 'Software engineer'
}, {
  id: '4',
  name: 'Siraj',
  subOrdinatesCount: 0,
  designation: 'Senior engineer'
}];

export const TAGS_DATA_SIMPLE = [
  {
    Id: 72,
    full_name: 'Anonymous Person',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore consequatur vitae iusto explicabo adipisci mollitia amet porro incidunt quos dolorum.',
  },
  {
    Id: 320,
    full_name: 'data 2',
    description: null
  },
  {
    Id: 259,
    full_name: 'Devil',
    description: 'Tempore consequatur vitae iusto explicabo adipisci mollitia amet porro incidunt.',
  },
  {
    Id: 253,
    full_name: 'Dexter\'s Lab',
    description: 'Tempore consequatur',
  },
];

export const TAGS_DATA_IMAGES = [
  {
    Id: 72,
    full_name: 'Anonymous Person',
    image_url: 'https://user-images.githubusercontent.com/462213/65887262-f1f13c00-e39d-11e9-9846-1019b8f4d3bb.jpg',
  },
  {
    Id: 320,
    full_name: 'data 2',
    image_url: 'https://user-images.githubusercontent.com/462213/65887262-f1f13c00-e39d-11e9-9846-1019b8f4d3bb.jpg',
  },
  {
    Id: 259,
    full_name: 'Devil',
    image_url: 'https://user-images.githubusercontent.com/462213/65887262-f1f13c00-e39d-11e9-9846-1019b8f4d3bb.jpg',
  }
];
