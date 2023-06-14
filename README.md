# ������Ϸ 

## һ����pixi.js��д��h5������Ϸ��������electron���Ϊexe��֧���ƶ��ˣ�Ҳ������webview�ؼ����Ϊapp���ƶ���ʹ��

## ����˵�� 

```
  cnpm@6.2.0  
  npm@6.14.13  
  node@12.22.7  
  npminstall@3.28.0  
  
  npm config list  
  electron_mirror = "https://npm.taobao.org/mirrors/electron/"  
  home = "https://www.npmjs.org"  
  registry = "https://registry.npmmirror.com/"  
```

## eslint˵��

```
  @typescript-eslint/eslint-plugin@5.33.1  
  @typescript-eslint/parser@.33.1  
  eslint@8.22.0  
  eslint-config-prettier@8.5.0  
  eslint-config-standard@17.0.0  
  eslint-webpack-plugin@3.2.0  
  prettier@2.7.1  
```

## �ؼ���˵��

```
  @pixi/sound@^4.3.3 //һ�����������
  @zip.js/zip.js@2.4.10 // һ��ѹ������ⷽ����Դ���
  intersects@2.7.2 // ��ѧ��ײ�жϿ�
  lodash@4.17.20 // һ������js�����õ������� ǳ����
  pixi-filters@4.2.0 // һ��pixi��shader�� ģ����Ť����ߵȹ���
  pixi-spine@3.0.13 // spine����֧�ֿ� ���ǶԲ�ͬspine�汾���˼���
  pixi.js@6.5.9 // һ����Ⱦ��
  uglify-js@^3.17.4 // ���ѹ��js����Ĺ��߿�
```
<!-- ?? -->

## Ŀ¼˵��


``` 
towerDefense
��  ?.eslintignore // eslint�ų�Ŀ¼
��  ?.eslintrc.js // eslint����Ŀ¼
��  ?.gitignore // git�ų�Ŀ¼
��  ?package.json // �������ļ�
��  ?README.md // readme�ļ�
��  ?tsconfig.json // ts�����ļ�
��  ?typedoc.json // typedoc �ĵ��Զ����������ļ�
��  ?webpack.config.gen.js // gameData.bin ������Ŀ
��  ?webpack.config.js  // 
��  ?webpack.config.plist.js // plist�鿴��Ŀ
��  ?webpack.config.tiled.js // ��ͼ�༭����Ŀ
��  ?yarn.lock // yarn��¼�ļ�
��  
����?.vscode
��      ?settings.json // vscode��Ŀ������
��      
����?build // ����ļ���
��      ?build.js // ��Ŀ���nodejs�ű� �ƶ���̬��Դ 
��      ?docs.js // �ĵ����nodejs�ű�
��      
����?docs // �ĵ��ļ���
��      ?��ɫ����.pdf // ��ɫ����pdf��ʽ
��      ?��ɫ����.xlsx // ��ɫ����xlsx��ʽ
��      
����?eleBuild // electron����ļ��� ��Ҫ���Ƴ������������ļ��е���
��      ?.gitignore // git�ų�Ŀ¼
��      ?buildע��.txt
��      ?forge.config.js // ��������ļ�
��      ?index.html // ���html�ļ�
��      ?index.js // ���js�ļ�
��      ?package.json // �������ļ�
��      ?yarn.lock // yarn��������ʷ
��      
����?example // ������������ļ���
��  ����?editTiledmap // ���α༭������ļ���
��  ��  ��  ?all.html
��  ��  ��  ?all.ts
��  ��  ��  
��  ��  ����?src // ���α༭��src�ļ���
��  ��      ��  ?index.ts // ����js 
��  ��      ��  
��  ��      ����?config // �Ҳ�˵��༭����
��  ��      ��      ?rightBarRenderConfig.ts
��  ��      ��      
��  ��      ����?utils // �༭����Ҫ�Ĺ���Ŀ¼
��  ��      ��      ?enum.ts
��  ��      ��      ?viewUtils.ts
��  ��      ��      
��  ��      ����?viewArea
��  ��              ?headMenu.ts
��  ��              ?imageList.ts
��  ��              ?rightBar.ts
��  ��              
��  ����?example // ��Ϸ��������ļ���
��  ��      all.html
��  ��      all.ts
��  ��      test.ts
��  ��      
��  ����?examplegen // ����gameData.bin��������ļ���
��  ��  ��  all.html
��  ��  ��  all.ts
��  ��  ��  allbuf.ts
��  ��  ��  
��  ��  ����?src
��  ��      ��  main.ts
��  ��      ��  
��  ��      ����?class
��  ��      ��      GameData.ts
��  ��      ��      
��  ��      ����?scss
��  ��      ��      main.scss
��  ��      ��      
��  ��      ����?utils
��  ��              keyDes.ts
��  ��              type.ts
��  ��              utils.ts
��  ��              
��  ��      
��  ����?seePlist // �鿴plist����ļ���
��          all.html
��          all.ts
��          
��      
����?public // ��ԴĿ¼�ļ���
��  ����?audio // �����ļ���
��  ��      openMenu.wav
��  ��      
��  ����?gameData // ��Ϸ�����ļ���
��  ��  ��  config.json // ��Ϸ����json
��  ��  ��  gameData.bin // spine���ݣ��������������bin�ļ� 
��  ��  ��  
��  ��  ����?actor // ��ɫ�Զ�˵��json
��  ��  ��      zh.json
��  ��  ��      
��  ��  ����?lang // �����ļ���
��  ��  ��      zh.json
��  ��  ��      
��  ��  ����?mod // mod�ļ���
��  ��         res.json
��  ��        
��  ��          
��  ����?img // ͼƬ�ļ���
��  ��          
��  ����?plist // plist�ļ���
��  ��      
��  ����?scene // �����ļ���
��  ��              
��  ����?script // ����js�ļ���
��          core.js
��          
����?spine // ʹ��spine���� ��������ֻ�ǿ� ����ʹ������gameData.bin��
��      
����?src
    ��  
    ��      
    ����?class // ���ļ���
    ��  ��  behaviorTree.ts // ��Ϊ��
    ��  ��  bullet.ts // �ӵ���
    ��  ��  camera.ts // ��ͷ�� δ���
    ��  ��  gameMenu.ts // ��Ϸ�˵���
    ��  ��  gameText.ts // ����������
    ��  ��  goods.ts // ��Ʒ��
    ��  ��  gun.ts // ǹ��
    ��  ��  message.ts // ������Ϣ������ on off �ȷ���
    ��  ��  openApi.ts // �ű���
    ��  ��  passive.ts  // ��Ϸ������
    ��  ��  role.ts // ��ɫ��
    ��  ��  task.ts // ������ δʹ��
    ��  ��  tiledmap.ts // ��ͼ����
    ��  ��  
    ��  ����?gameObject // ��Ϸ����������
    ��          base.ts // ���������� base�� color��point��
    ��          dumpObject.ts // ��̬������
    ��          gameObject.ts // ��Ϸ������
    ��          sportBase.ts // �˶�������
    ��          
    ����?core // ����������ļ���
    ��      gameMain.ts // �ض���Ϸ��Ҫ����
    ��      main.ts // ��Ϸ������
    ��      
    ����?css // css�ļ���
    ��      main.css
    ��      
    ����?defaultData // Ĭ��������
    ��      base.ts
    ��      lang.ts
    ��      mod.ts
    ��      save.ts
    ��      scene.ts
    ��      task.ts
    ��      terrain.ts
    ��      ui.ts
    ��      
    ����?dialog // �����Ի��򴴽�����
    ��      failDialog.ts // ʧ�ܵ���
    ��      winDialog.ts // ʤ������
    ��      
    ����?gameClass // �ض���Ϸ��
    ��      enemy.ts // ������
    ��      processDialog.ts // �Ի��������
    ��      sceneUtils.ts // ������չ��
    ��      spawnEnemies.ts // ���˳�����
    ��      tower.ts // ����
    ��      
    ����?test // �����ļ���
    ��      dialogPannel.ts
    ��      
    ����?ui // ui�ļ���
    ��           
    ����?utils // ������
    ��      AStar.ts // A*Ѱ·��
    ��      defaultTypeEx.ts
    ��      enum.ts  // ö����
    ��      plist.ts // plist��չ�ܲ鿴
    ��      spine.ts // spine�汾����
    ��      TextMetrics.ts // ���ֻ�����д�� δ���ƣ���дpixi�����������Ⱦ���������|n0x00000000|r��ɫ��Ⱦ
    ��      types.ts // �ṹ��
    ��      utils.ts // ����������
    ��      utilsPro.ts // ��Ϸ��չ��
    ��      
    ����?view
            menuAttr.ts // �˵�������ͼ δʹ��
            menuEq.ts // װ��Ԥ����ͼ δʹ��
            menuSysyem.ts // ϵͳ�˵���ͼ δʹ��
            menuTask.ts // ����Ŀ¼ δʹ��

```

## ��װ���� 
```
yarn  
npm run dev  
```

## ��ϸ����˵��

(1)�������̽���


## ��������

�����Ŀ�����а���,����������һ�����ȡ�  

![������](https://github.com/yinhui1129754/towerDefense/blob/main/mdImg/zsm.jpg?raw=true)

���ͼƬ����ʾ���� [����](https://yinhui1129754.coding.net/public/source/image/git/files/master/zsm.jpg)

## ע����

### ����id�����ظ� ��Ȼ���޷����Ĵ�С����