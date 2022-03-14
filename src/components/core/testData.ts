export const data = {

  'buildings': [
    {
      buildingId: 1,
      buildingName: 'Building Name',
      'floors': [
        {
          'floorId': 1,
          'floorName': '1',
          'rooms': [
            {
              'roomNumber': 1,
              'roomName': 'ICU1',
              'beds': [
                {
                  'bedId': 1,
                  'bedNumber': 'ICU1BED01'
                },
                {
                  'bedId': 2,
                  'bedNumber': 'ICU1BED02'
                },
                {
                  'bedId': 3,
                  'bedNumber': 'ICU1BED03'
                }
              ]
            },
            {
              'roomNumber': 2,
              'roomName': 'ICU2',
              'beds': [
                {
                  'bedId': 3,
                  'bedNumber': 'ICU2BED03'
                }
              ]
            }
          ]
        },
        {
          'floorId': 2,
          'floorName': '2',
          'rooms': [
            {
              'roomNumber': 3,
              'roomName': 'ICU3',
              'beds': [
                {
                  'bedId': 3,
                  'bedNumber': 'ICU3BED03'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};