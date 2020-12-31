export default [
  {
    url: '/table/demo',
    type: 'get',
    response: req => {
      if (req.query.pageIndex === '1') {
        return {
          success: true,
          errorCode: '000000',
          errorMessage: null,
          data: {
            content: [{ account: 'Eric', userName: '田艳', userId: 7290895740056192, id: 8132034213563048 }, { account: 'Betty', userName: '金芳', userId: -5159991794150200, id: -6531968585844684 }, { account: 'Joseph', userName: '江磊', userId: 8610080809960604, id: 4745703388922660 }, { account: 'Eric', userName: '龚洋', userId: 8877468598126432, id: 7945237385747416 }, { account: 'Richard', userName: '孟明', userId: 4952908335279000, id: 5669641742444356 }, { account: 'Mary', userName: '曾丽', userId: 8568298484856012, id: -4397818931473256 }, { account: 'Kenneth', userName: '于秀兰', userId: 8429061014342620, id: 38958862465468 }, { account: 'Dorothy', userName: '赵涛', userId: 6656341355247132, id: 6622956973948588 }, { account: 'Anna', userName: '郭杰', userId: 3575794377924404, id: 7900506121837800 }, { account: 'Eric', userName: '黄娜', userId: -3060318017429952, id: -5480836759880396 }],
            currentPage: req.query.pageIndex,
            totalPages: 2,
            totalNumbers: 20
          }

        }
      } else {
        return {
          success: true,
          errorCode: '000000',
          errorMessage: null,
          data: {
            content: [{ account: 'Elizabeth', userName: '尹秀英', userId: 5329467000538616, id: -4905916396234452 }, { account: 'Brian', userName: '马杰', userId: -4556944153599028, id: -7664863641929056 }, { account: 'Dorothy', userName: '雷敏', userId: -3868098010299156, id: 6347031219115848 }, { account: 'Michael', userName: '龙伟', userId: 2547932438745948, id: 2398653372254240 }, { account: 'Anthony', userName: '赖洋', userId: 1800706014355328, id: -4705903723692968 }, { account: 'Scott', userName: '周艳', userId: 1739919180154840, id: -6637222966747444 }, { account: 'Gary', userName: '钱艳', userId: 6102424178981136, id: -5366079771018604 }, { account: 'William', userName: '廖涛', userId: -6375182759795744, id: -5515649296040340 }, { account: 'Steven', userName: '丁军', userId: 5369428235414744, id: 6175934249384848 }, { account: 'Kenneth', userName: '龚超', userId: -1706308151277116, id: 7369926159983440 }],
            currentPage: req.query.pageIndex,
            totalPages: 2,
            totalNumbers: 20
          }
        }
      }
    }
  }
]
