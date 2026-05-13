/**
 * Golden Twenties Scenario Integration
 * Connects the Dendrynexus Golden Twenties scenario with game state
 * 
 * Triggered in April 1928 during the period of economic prosperity
 * Increases republican support by up to 2% based on player choice
 */

class GoldenTwentiesIntegration {
  /**
   * Check if scenario conditions are met
   * @param {Object} gameState - Game engine state
   * @returns {Boolean} True if it's April 1928 and conditions allow
   */
  static shouldTrigger(gameState) {
    const currentYear = gameState.currentYear || 0;
    const currentMonth = gameState.currentMonth || 0;
    const scenarioAlreadyRun = gameState['golden-twenties-scenario-complete'];

    return (
      currentYear === 1928 &&
      currentMonth === 4 &&
      !scenarioAlreadyRun
    );
  }

  /**
   * Initialize the scenario
   * @param {Object} gameState - Game engine state
   * @returns {Object} Scene entry point and initial variables
   */
  static initializeScenario(gameState) {
    return {
      sceneId: 'golden-twenties-main',
      variables: {
        'golden-twenties-active': true,
        'golden-twenties-choice': null,
        'republic-support-increase': 0,
        'current-republic-support': gameState['republic-support'] || 0,
        'scenario-outcome': null
      }
    };
  }

  /**
   * Apply scenario outcome based on player choice
   * @param {String} choiceType - One of: 'consolidate', 'party-benefit', 'cautious'
   * @param {Object} gameState - Current game state
   * @returns {Object} Updated game state
   */
  static applyScenarioOutcome(choiceType, gameState) {
    const updates = {
      'golden-twenties-scenario-complete': true,
      'scenario-outcome': choiceType,
      'republic-support': gameState['republic-support'] || 0
    };

    switch (choiceType) {
      case 'consolidate':
        updates['republic-support'] += 2;
        updates['republican-commitment'] = (gameState['republican-commitment'] || 0) + 1;
        updates['radical-party-appeal'] = Math.max(0, (gameState['radical-party-appeal'] || 0) - 1);
        updates['scenario-description'] = 'Your party strengthened republican institutions during prosperity.';
        break;

      case 'party-benefit':
        updates['party-treasury'] = (gameState['party-treasury'] || 0) + 3;
        updates['party-organization'] = (gameState['party-organization'] || 0) + 2;
        updates['scenario-description'] = 'Your party benefited economically but did not strengthen the republic.';
        break;

      case 'cautious':
        updates['republic-support'] += 0.5;
        updates['party-credibility'] = (gameState['party-credibility'] || 0) + 1;
        updates['scenario-description'] = 'Your party warned of fragility but gained credibility.';
        break;

      default:
        updates['scenario-description'] = 'Unknown outcome.';
    }

    return updates;
  }

  /**
   * Get scenario context for display
   * @param {Object} gameState - Game engine state
   * @returns {Object} Human-readable scenario context
   */
  static getScenarioContext(gameState) {
    return {
      scenarioType: 'golden-twenties',
      date: 'April 1928',
      description: 'The Weimar Republic experiences economic prosperity and renewed confidence',
      economicConditions: 'Thriving',
      americanInvestment: 'High',
      radicalsInfluence: 'Declining',
      currentRepublicSupport: gameState['republic-support'] || 0
    };
  }
}

/**
 * Dendrynexus Scene Hook Integration
 */
class GoldenTwentiesSceneHook {
  static beforeRender(sceneState, gameState) {
    sceneState.variables['republic-support'] = gameState['republic-support'] || 0;
    sceneState.variables['economy-strength'] = gameState['economy-strength'] || 8;
    sceneState.variables['unemployment'] = gameState['unemployment'] || 3;
    sceneState.variables['american-investment'] = gameState['american-investment'] || 'high';
    return sceneState;
  }

  static afterCompletion(sceneState, gameState) {
    const choiceType = sceneState.variables['golden-twenties-choice'];
    const updates = GoldenTwentiesIntegration.applyScenarioOutcome(choiceType, gameState);
    const updatedState = { ...gameState, ...updates };

    console.log('Golden Twenties Scenario Complete:');
    console.log(`  Choice: ${choiceType}`);
    console.log(`  Republic Support Change: +${updates['republic-support'] - (gameState['republic-support'] || 0)}%`);
    console.log(`  New Republic Support: ${updatedState['republic-support']}%`);

    return updatedState;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GoldenTwentiesIntegration,
    GoldenTwentiesSceneHook
  };
}
