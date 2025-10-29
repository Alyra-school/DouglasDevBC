import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

async function setUpSmartContract() {
  const counter = await ethers.deployContract("Counter");
  const [owner] = await ethers.getSigners();
  
  return { counter, owner };
}

async function setUpAndInc() {
  let counter: any;
  let owner: any;
  ({ counter, owner } = await setUpSmartContract());
  await counter.inc();
  return { counter, owner };
}


describe("Counter contract", function () {
  describe("Tests tel fonction", function () {
    let counter : any;
    let owner : any;

    beforeEach(async () => {
      ({ counter, owner } = await setUpSmartContract());
    });   
    
    it("Should deploy with x = 0", async function () {
      expect(await counter.x()).to.equal(0n);
    });

    it("inc Should increment x = 1", async function () {
      await counter.inc();
      expect(await counter.x()).to.equal(1n);
    });

    it("get storage at 1", async function () {
      await counter.inc();
      expect(await ethers.provider.getStorage(counter.target, 0)).to.equal(1n);
    });

    it("get storage de ma balance", async function () {
      await counter.inc();
      const calculslot = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [owner.address, 1n],
        ),
      );
      expect(await ethers.provider.getStorage(counter.target, calculslot)).to.equal(100n);
    });


    it("should revert on triple inc", async function () {
      await counter.inc();
      await counter.inc();
      await expect(counter.inc()).to.be.revertedWith("pas trop haut");
    });
  

    it("Should emit the Increment event when calling the inc() function", async function () {
      await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
    });

    it("Should get blocknumber", async function () {
      const blocknumber = await ethers.provider.getBlockNumber();
      await counter.putBlockNumber(blocknumber);
      expect(await counter.blocknumber()).to.equal(blocknumber);
    });

    it("Should increment blocknumber", async function () {
      const blocknumber = await ethers.provider.getBlockNumber();
      console.log("Current block number:", blocknumber);

      
      await counter.putBlockNumber(blocknumber);
      const testblocknumber = await ethers.provider.getBlockNumber();
      console.log("Current block number:", testblocknumber);
      expect(await counter.blocknumber()).to.equal(blocknumber);
  
      await networkHelpers.mine(5);   
      await networkHelpers.time.increase(600);   
      const newblocknumber = await ethers.provider.getBlockNumber();
      console.log("new block number:", newblocknumber);

      await counter.putBlockNumber(newblocknumber);
      expect(await counter.blocknumber()).to.equal(blocknumber + 7);
    });

  });
  describe("Complexe fonction", function () {
    it("The sum of the Increment events should match the current value", async function () {
      const counter = await ethers.deployContract("Counter");
      const deploymentBlockNumber = await ethers.provider.getBlockNumber();

      // run a series of increments
      for (let i = 1; i <= 10; i++) {
        await counter.incBy(i);
      }

      const events = await counter.queryFilter(
        counter.filters.Increment(),
        deploymentBlockNumber,
        "latest",
      );

      // check that the aggregated events match the current value
      let total = 0n;
      for (const event of events) {
        total += event.args.by;
      }

      expect(await counter.x()).to.equal(total);
    });
  });
});
