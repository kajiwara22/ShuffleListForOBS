let shuffleSourceSeed;
window.onload = function() {
    // ボタン要素を取得する
    const myButton = document.getElementById("ShuffleBtn");
    const userList = document.getElementById("userList");
    shuffleSourceSeed = localStorage.getItem("sourceSeed")
    if(!shuffleSourceSeed)
    {
      shuffleSourceSeed = 88675123
    }else{
      shuffleSourceSeed = parseInt(shuffleSourceSeed)
    }

    // ボタンにクリックイベントリスナーを追加する
    myButton.addEventListener("click", shuffleUser);
    loadUser();
}

const loadUser = function(useEffect = false){
    while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
    }
    fetch("users.txt?time=" + new Date().getTime()) // example.txtはテキストファイルのパスに置き換えてください。
    .then(response => response.text())
    .then(data => {
      const seed = new Random(shuffleSourceSeed)
      const shuffledLines = shuffleArray(data,seed)
      shuffledLines.forEach(function(line) {
        const listItem = document.createElement("li");
        const textNode = document.createTextNode(line);
        listItem.appendChild(textNode);
        userList.appendChild(listItem);
     });
      if(useEffect)
      {
        const elementList = document.querySelectorAll('li');
        const effectList = new Array();
        for (let i = 0; i < elementList.length; i++) {
          let element = elementList[i];
          effectList[i] = new ShuffleText(element);
          effectList[i].start();
        }
      }
    });
}
const shuffleUser = function(){
  const seed =  new Random(shuffleSourceSeed)
  shuffleSourceSeed = seed.nextInt(10000000,99999999)
  localStorage.setItem("sourceSeed",shuffleSourceSeed)
  loadUser(useEffect=true);
}

class Random {
  constructor(seed = 34079066) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed;
  }
  
  // XorShift
  next() {
    let t;
    t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
  }

  nextInt(min, max) {
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }
}

function shuffleArray(data, seed) {
  const array = data.split("\n")
  const shuffledArray = array.slice(); // 元の配列のコピーを作成
  // Fisher-Yates Shuffle Algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    let shuffleSeed = seed.nextInt(0,i)
    const j = shuffleSeed;
    console.log(i,j)
    if (i >= 0 && i < shuffledArray.length && j >= 0 && j < shuffledArray.length) {
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }else{
      console.log("入れ替え処理を行いませんでした",i,j)
    }
  }
  return shuffledArray
}
 