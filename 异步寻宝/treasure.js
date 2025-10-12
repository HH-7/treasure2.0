// 模拟宝藏地图API
class TreasureMap {
    static async getInitialClue() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "在古老的图书馆里找到了第一个线索...";
    }

    static async decodeAncientScript(clue) {
        if (!clue) throw new Error("没有线索可以解码!");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "解码成功!宝藏在一座古老的神庙中...";
    }

    static async searchTemple() {
        await new Promise(resolve => setTimeout(resolve, 1200));
        if (Math.random() < 0.4) throw new Error("糟糕!遇到了神庙守卫!");
        return "找到了一个神秘的箱子，但箱子被锁住了...";
    }

    static async exploreJungle() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (Math.random() < 0.3) throw new Error("丛林中的猛兽阻挡了去路!");
        return "成功穿越丛林!发现了一个黑暗的洞穴入口...";
    }

    static async searchCave() {
        await new Promise(resolve => setTimeout(resolve, 1200));
        if (Math.random() < 0.3) throw new Error("洞穴坍塌了!必须寻找其他入口...");
        return "在洞穴深处找到了传说中的宝藏!";
    }

    static async openTreasureBox() {
        await new Promise(resolve => setTimeout(resolve, 800));
        return "恭喜!你找到了传说中的宝藏!";
    }
}

// 使用async/await的寻宝函数
async function findTreasure() {
    try {
        // 步骤1: 获取初始线索
        const clue = await TreasureMap.getInitialClue();
        console.log("步骤1:", clue);
        
        // 步骤2: 解码古老文字
        const location = await TreasureMap.decodeAncientScript(clue);
        console.log("步骤2:", location);
        
        // 步骤3: 探索神庙（带重试机制）
        let templeResult;
        let attempts = 0;
        while (attempts < 2) {
            try {
                templeResult = await TreasureMap.searchTemple();
                console.log("步骤3:", templeResult);
                break;
            } catch (error) {
                attempts++;
                console.warn("探索神庙失败 (尝试 " + attempts + "/2):", error);
                if (attempts >= 2) throw error;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // 步骤4: 穿越丛林（带重试机制）
        attempts = 0;
        let jungleResult;
        while (attempts < 2) {
            try {
                jungleResult = await TreasureMap.exploreJungle();
                console.log("步骤4:", jungleResult);
                break;
            } catch (error) {
                attempts++;
                console.warn("穿越丛林失败 (尝试 " + attempts + "/2):", error);
                if (attempts >= 2) throw error;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // 步骤5: 洞穴寻宝（带重试机制）
        attempts = 0;
        let caveResult;
        while (attempts < 2) {
            try {
                caveResult = await TreasureMap.searchCave();
                console.log("步骤5:", caveResult);
                break;
            } catch (error) {
                attempts++;
                console.warn("洞穴寻宝失败 (尝试 " + attempts + "/2):", error);
                if (attempts >= 2) throw error;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // 找到宝藏
        const treasure = await TreasureMap.openTreasureBox();
        console.log(treasure);
        console.log("寻宝成功!");
        
    } catch (error) {
        console.error("任务失败:", error);
    }
}

findTreasure();