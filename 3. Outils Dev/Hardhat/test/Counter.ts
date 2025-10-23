import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

async function setUpSmartContracts() {
  const [owner] = await ethers.getSigners();
  const counter = await ethers.deployContract("Counter");
  return { owner, counter };
}

describe.only("Counter", function () {
    let counter : any;
    let owner : any;

  describe.only("Counter premiers tests", function () {

    beforeEach(async () => {
      ({ counter, owner }= await setUpSmartContracts());
      return { counter, owner};
    });


    it("Should initialize with a value of 0", async function () {
      expect(await counter.x()).to.equal(0n);
    });

    it("Should increment the counter value by 1 when calling the inc() function", async function () {
      await counter.inc();
      expect(await counter.x()).to.equal(1n);
    });

    it("Should emit the Increment event when calling the inc() function", async function () {
      await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
    });

     it("Should revert when triple Increment", async function () {
      await counter.inc();
      await counter.inc();
      console.log(await counter.x())
      await expect(counter.inc()).to.be.revertedWith("trop haut");
    });

  });

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
