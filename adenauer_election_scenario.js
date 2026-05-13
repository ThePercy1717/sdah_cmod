/**
 * Adenauer Election Scenario
 * Handles the election of Adenauer as President with NSDAP, KPD, and DNVP majority
 * Creates minority government with Centrum, DVP, BVP, DDP, Others, and SPD
 */

class AdenaurElectionScenario {
  constructor() {
    this.coalitionParties = ['Centrum', 'DVP', 'BVP', 'DDP', 'Others', 'SPD'];
    this.nsdapKpdDnvpMajority = ['NSDAP', 'KPD', 'DNVP'];
    this.scenarioState = 'new_elections';
    this.chancellor = null;
    this.coalition = [];
  }

  /**
   * Initialize the scenario - Adenauer elected, new elections held
   */
  initiateScenario() {
    console.log('Adenauer elected President');
    console.log('NSDAP, KPD, and DNVP hold majority');
    console.log('"Adenauer sees the urge to retain faith in republic"');
    console.log('New elections are held...\n');
    
    this.triggerNewElections();
  }

  /**
   * Trigger new elections resulting in minority government
   */
  triggerNewElections() {
    console.log('Election Results: Minority Government Required');
    console.log('Coalition parties: ' + this.coalitionParties.join(', '));
    this.scenarioState = 'government_formation';
    this.promptPlayerGovernmentParticipation();
  }

  /**
   * Player decides whether to participate in government
   */
  promptPlayerGovernmentParticipation() {
    console.log('\n=== GOVERNMENT FORMATION ===');
    console.log('Player must decide: Will you participate in the government coalition?\n');
    console.log('Available options:');
    console.log('1. Accept government participation');
    console.log('2. Refuse government participation\n');
  }

  /**
   * Process player's government participation decision
   * @param {boolean} acceptParticipation - Player's decision
   */
  processParticipationDecision(acceptParticipation) {
    if (!acceptParticipation) {
      console.log('Player has refused government participation.\n');
      this.scenarioState = 'no_government';
      return;
    }

    console.log('Player has accepted government participation.\n');
    this.scenarioState = 'chancellor_selection';
    this.determineChancellor();
  }

  /**
   * Determine who will be Chancellor based on strongest coalition party
   */
  determineChancellor() {
    console.log('=== CHANCELLOR SELECTION ===');
    console.log('Strongest coalition party determines chancellorship...\n');

    // Placeholder for party strength determination
    // In actual implementation, would pull from game engine party data
    this.chancellor = null;
  }

  /**
   * Handle Centrum as strongest party - Brüning becomes Chancellor
   */
  centrumAsStrongest() {
    console.log('Centrum is the strongest coalition party.');
    this.chancellor = 'Heinrich Brüning';
    console.log(`${this.chancellor} becomes Chancellor.\n`);
    this.scenarioState = 'government_formed_bruning';
  }

  /**
   * Handle SPD as strongest party - complex DVP relation check
   */
  spdAsStrongest() {
    console.log('SPD is the strongest coalition party.\n');
    this.checkDVPRelations();
  }

  /**
   * Check SPD-DVP relations to determine if DVP accepts SPD Chancellor
   * @param {number} relationScore - SPD-DVP relation score (0-100)
   */
  checkDVPRelations(relationScore) {
    console.log('=== DVP RELATIONS CHECK ===');
    console.log(`Current SPD-DVP relation score: ${relationScore}/100\n`);

    if (relationScore < 40) {
      console.log('DVP relations with SPD are below 40.');
      console.log('DVP refuses to accept an SPD Chancellor.\n');
      this.handleDVPRefusal();
    } else {
      console.log('DVP relations are sufficient. SPD can provide Chancellor.');
      this.spdChancellorWels();
    }
  }

  /**
   * Handle DVP refusal of SPD Chancellor - player has two options
   */
  handleDVPRefusal() {
    console.log('=== CHANCELLOR CRISIS ===');
    console.log('Player must decide:');
    console.log('1. Quit the coalition - Do not participate in the new government');
    console.log('2. Transfer chancellorship to Heinrich Brüning (Centrum)\n');
  }

  /**
   * Player chooses to quit the coalition
   */
  playerQuitsCoalition() {
    console.log('Player has quit the coalition.');
    console.log('SPD does not participate in the new government.\n');
    this.scenarioState = 'coalition_collapsed';
  }

  /**
   * Player chooses to transfer chancellorship to Brüning
   */
  transferToBruning() {
    console.log('Chancellorship transferred to Heinrich Brüning (Centrum).');
    this.chancellor = 'Heinrich Brüning';
    console.log(`${this.chancellor} becomes Chancellor.\n`);
    this.scenarioState = 'government_formed_bruning_compromise';
  }

  /**
   * Otto Wels from SPD becomes Chancellor (when DVP relations are adequate)
   */
  spdChancellorWels() {
    console.log('Otto Wels from SPD becomes Chancellor.');
    this.chancellor = 'Otto Wels';
    console.log(`${this.chancellor} begins forming SPD-led minority government.\n`);
    this.scenarioState = 'government_formed_wels';
  }

  /**
   * Get current scenario state
   */
  getState() {
    return {
      scenarioState: this.scenarioState,
      chancellor: this.chancellor,
      coalitionParties: this.coalitionParties
    };
  }
}

// Export for use in game engine
module.exports = AdenaurElectionScenario;
