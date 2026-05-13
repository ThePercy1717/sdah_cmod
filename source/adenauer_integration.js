/**
 * Adenauer Election Scenario Integration
 * Connects the Dendrynexus Adenauer scenario with party strength data and game state
 * 
 * This module bridges between:
 * - Game party strength/quality data (stats)
 * - Coalition logic (determines chancellor based on party strength)
 * - Player relationship tracking (DVP-SPD relations)
 * - Scene state variables (for Dendrynexus integration)
 */

class AdenaurIntegration {
  /**
   * Initialize the scenario when conditions are met
   * @param {Object} gameState - Game engine state with party data
   * @returns {Object} Scene entry point and initial variables
   */
  static initializeScenario(gameState) {
    return {
      sceneId: 'adenauer-offer',
      variables: {
        'coalition-parties': ['Centrum', 'DVP', 'BVP', 'DDP', 'Others', 'SPD'],
        'minority-gov-offered': true,
        'adenauer-coalition-decision': null,
        'coalition-strongest': this.determineStrongestCoalitionParty(gameState),
        'party-strength': gameState.partyStrengths || {},
        'dvp-spd-relations': gameState.relationships?.['DVP-SPD'] || 0,
        'scenario-outcome': null,
        'final-chancellor': null,
        'chancellor-crisis': false
      }
    };
  }

  /**
   * Determine which coalition party is strongest
   * @param {Object} gameState - Game engine state
   * @returns {String} Name of strongest coalition party
   */
  static determineStrongestCoalitionParty(gameState) {
    const coalitionParties = ['Centrum', 'DVP', 'BVP', 'DDP', 'Others', 'SPD'];
    const partyStrengths = gameState.partyStrengths || {};

    let strongest = coalitionParties[0];
    let highestStrength = partyStrengths[strongest] || 0;

    for (let party of coalitionParties) {
      const strength = partyStrengths[party] || 0;
      if (strength > highestStrength) {
        strongest = party;
        highestStrength = strength;
      }
    }

    return strongest;
  }

  /**
   * Check if DVP-SPD relations permit SPD chancellor
   * @param {Object} gameState - Game engine state
   * @returns {Boolean} True if relations >= 40
   */
  static checkDVPSPDRelations(gameState) {
    const dvpSpdRelation = gameState.relationships?.['DVP-SPD'] || 0;
    return dvpSpdRelation >= 40;
  }

  /**
   * Determine the final chancellor based on party configuration and relations
   * @param {Object} gameState - Game engine state
   * @param {String} coalitionStrongest - The strongest coalition party
   * @returns {String} Name of the chancellor or null
   */
  static determineFinalChancellor(gameState, coalitionStrongest) {
    if (coalitionStrongest === 'Centrum') {
      return 'Heinrich Brüning';
    } else if (coalitionStrongest === 'SPD') {
      if (this.checkDVPSPDRelations(gameState)) {
        return 'Otto Wels';
      } else {
        // SPD cannot be chancellor due to DVP opposition
        // Return null to trigger chancellor crisis
        return null;
      }
    }
    return null;
  }

  /**
   * Handle the outcome of the scenario
   * @param {String} outcomeType - One of: 'bruning-chancellor', 'wels-chancellor', 
   *                                'bruning-compromise', 'coalition-failed-*'
   * @param {Object} gameState - Game engine state to update
   * @returns {Object} Updated game state with scenario consequences
   */
  static applyScenarioOutcome(outcomeType, gameState) {
    const updates = {
      'adenauer-scenario-complete': true,
      'scenario-outcome': outcomeType,
      'government-formed': false
    };

    switch (outcomeType) {
      case 'bruning-chancellor':
      case 'bruning-chancellor-compromise':
        updates['chancellor'] = 'Heinrich Brüning';
        updates['chancellor-party'] = 'Centrum';
        updates['government-formed'] = true;
        updates['coalition-stability'] = 6; // Moderate stability
        updates['coalition-members'] = ['Centrum', 'DVP', 'BVP', 'DDP', 'Others', 'SPD'];
        break;

      case 'wels-chancellor':
        updates['chancellor'] = 'Otto Wels';
        updates['chancellor-party'] = 'SPD';
        updates['government-formed'] = true;
        updates['coalition-stability'] = 5; // Lower stability (DVP-SPD tensions)
        updates['coalition-members'] = ['Centrum', 'DVP', 'BVP', 'DDP', 'Others', 'SPD'];
        break;

      case 'coalition-failed-no-participation':
        updates['government-formed'] = false;
        updates['political-crisis'] = true;
        updates['crisis-type'] = 'government-formation-failed';
        updates['coalition-members'] = [];
        break;

      case 'coalition-failed-withdrew':
        updates['government-formed'] = false;
        updates['political-crisis'] = true;
        updates['crisis-type'] = 'coalition-withdrawal';
        updates['coalition-members'] = ['Centrum', 'DVP', 'BVP', 'DDP', 'Others'];
        break;

      default:
        updates['government-formed'] = false;
        updates['political-crisis'] = true;
        updates['crisis-type'] = 'unknown-failure';
    }

    return { ...gameState, ...updates };
  }

  /**
   * Get scenario context for display
   * @param {Object} gameState - Game engine state
   * @returns {Object} Human-readable scenario context
   */
  static getScenarioContext(gameState) {
    const strongest = this.determineStrongestCoalitionParty(gameState);
    const dvpRelation = gameState.relationships?.['DVP-SPD'] || 0;
    const chancellor = this.determineFinalChancellor(gameState, strongest);

    return {
      coalitionStrongest: strongest,
      dvpSPDRelation: dvpRelation,
      potentialChancellor: chancellor,
      coalitionMembers: ['Centrum', 'DVP', 'BVP', 'DDP', 'Others', 'SPD'],
      scenarioType: 'adenauer-election',
      description: 'Adenauer elected President with NSDAP/KPD/DNVP majority. New elections trigger minority government formation.'
    };
  }
}

/**
 * Dendrynexus Scene Hook Integration
 * Handles dynamic scene variable setting based on game state
 */
class AdenaurSceneHook {
  /**
   * Before-render hook: Set all necessary scene variables
   * @param {Object} sceneState - Dendrynexus scene state
   * @param {Object} gameState - Game engine state
   * @returns {Object} Updated scene state with all variables set
   */
  static beforeRender(sceneState, gameState) {
    const integration = AdenaurIntegration;

    // Determine coalition strongest party
    const coalitionStrongest = integration.determineStrongestCoalitionParty(gameState);
    sceneState.variables['coalition-strongest'] = coalitionStrongest;

    // Set DVP-SPD relations (will be used in check-dvp-relations scene)
    const dvpSpdRelation = gameState.relationships?.['DVP-SPD'] || 
                          (Math.random() * 50 + 20); // 20-70 range if not set
    sceneState.variables['dvp-spd-relations'] = dvpSpdRelation;

    // Determine if SPD can be chancellor
    const canSPDBeChancellor = integration.checkDVPSPDRelations(gameState);
    sceneState.variables['can-spd-be-chancellor'] = canSPDBeChancellor;

    // Set final chancellor
    const finalChancellor = integration.determineFinalChancellor(gameState, coalitionStrongest);
    if (finalChancellor) {
      sceneState.variables['final-chancellor'] = finalChancellor;
    }

    return sceneState;
  }

  /**
   * After-completion hook: Apply scenario outcomes to game state
   * @param {Object} sceneState - Final scene state after completion
   * @param {Object} gameState - Current game state
   * @returns {Object} Updated game state with scenario consequences
   */
  static afterCompletion(sceneState, gameState) {
    const outcomeType = sceneState.variables['scenario-outcome'];
    const updatedState = AdenaurIntegration.applyScenarioOutcome(outcomeType, gameState);

    // Log for debugging
    console.log('Adenauer Scenario Complete:');
    console.log(`  Outcome: ${outcomeType}`);
    console.log(`  Chancellor: ${updatedState.chancellor || 'None'}`);
    console.log(`  Government Formed: ${updatedState['government-formed']}`);

    return updatedState;
  }
}

// Export for use with game engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdenaurIntegration,
    AdenaurSceneHook
  };
}
