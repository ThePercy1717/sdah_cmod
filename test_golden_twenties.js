/**
 * Test suite for Golden Twenties scenario
 */

class GoldenTwentiesIntegration {
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
        break;

      case 'party-benefit':
        updates['party-treasury'] = (gameState['party-treasury'] || 0) + 3;
        updates['party-organization'] = (gameState['party-organization'] || 0) + 2;
        break;

      case 'cautious':
        updates['republic-support'] += 0.5;
        updates['party-credibility'] = (gameState['party-credibility'] || 0) + 1;
        break;
    }

    return updates;
  }
}

class GoldenTwentiesTest {
  static runAllTests() {
    console.log('='.repeat(70));
    console.log('GOLDEN TWENTIES SCENARIO TEST SUITE');
    console.log('='.repeat(70));

    let passed = 0;
    let failed = 0;

    // Test 1: Trigger condition check
    console.log('\n[TEST 1] Scenario Trigger Conditions');
    console.log('-'.repeat(70));
    try {
      const gameState = {
        currentYear: 1928,
        currentMonth: 4,
        'golden-twenties-scenario-complete': false
      };
      const shouldTrigger = GoldenTwentiesIntegration.shouldTrigger(gameState);
      
      if (shouldTrigger) {
        console.log('✓ PASS');
        console.log('  - Scenario triggers in April 1928');
        passed++;
      } else {
        throw new Error('Scenario should trigger in April 1928');
      }
    } catch (e) {
      console.error(`✗ FAIL: ${e.message}`);
      failed++;
    }

    // Test 2: Wrong month doesn't trigger
    console.log('\n[TEST 2] Scenario Does Not Trigger in Wrong Month');
    console.log('-'.repeat(70));
    try {
      const gameState = {
        currentYear: 1928,
        currentMonth: 5,
        'golden-twenties-scenario-complete': false
      };
      const shouldTrigger = GoldenTwentiesIntegration.shouldTrigger(gameState);
      
      if (!shouldTrigger) {
        console.log('✓ PASS');
        console.log('  - Scenario does not trigger in May 1928');
        passed++;
      } else {
        throw new Error('Scenario should not trigger in May 1928');
      }
    } catch (e) {
      console.error(`✗ FAIL: ${e.message}`);
      failed++;
    }

    // Test 3: Already completed scenario doesn't retrigger
    console.log('\n[TEST 3] Scenario Does Not Retrigger After Completion');
    console.log('-'.repeat(70));
    try {
      const gameState = {
        currentYear: 1928,
        currentMonth: 4,
        'golden-twenties-scenario-complete': true
      };
      const shouldTrigger = GoldenTwentiesIntegration.shouldTrigger(gameState);
      
      if (!shouldTrigger) {
        console.log('✓ PASS');
        console.log('  - Scenario does not trigger again if already completed');
        passed++;
      } else {
        throw new Error('Scenario should not trigger if already completed');
      }
    } catch (e) {
      console.error(`✗ FAIL: ${e.message}`);
      failed++;
    }

    // Test 4: Consolidate choice increases republic support by 2%
    console.log('\n[TEST 4] Consolidate Choice → +2% Republic Support');
    console.log('-'.repeat(70));
    try {
      const gameState = {
        'republic-support': 50,
        'republican-commitment': 0,
        'radical-party-appeal': 5
      };
      const updates = GoldenTwentiesIntegration.applyScenarioOutcome('consolidate', gameState);
      
      if (updates['republic-support'] === 52 &&
          updates['republican-commitment'] === 1 &&
          updates['radical-party-appeal'] === 4) {
        console.log('✓ PASS');
        console.log(`  - Republic support: 50% → ${updates['republic-support']}%`);
        console.log(`  - Republican commitment increased`);
        console.log(`  - Radical party appeal decreased`);
        passed++;
      } else {
        throw new Error('Consolidate outcome incorrect');
      }
    } catch (e) {
      console.error(`✗ FAIL: ${e.message}`);
      failed++;
    }

    // Test 5: Party-benefit choice doesn't increase republic support
    console.log('\n[TEST 5] Party-Benefit Choice → No Republic Support Change');
    console.log('-'.repeat(70));
    try {
      const gameState = {
        'republic-support': 50,
        'party-treasury': 10,
        'party-organization': 5
      };
      const updates = GoldenTwentiesIntegration.applyScenarioOutcome('party-benefit', gameState);
      
      if (updates['republic-support'] === 50 &&
          updates['party-treasury'] === 13 &&
          updates['party-organization'] === 7) {
        console.log('✓ PASS');
        console.log(`  - Republic support: 50% (unchanged)`);
        console.log(`  - Party treasury: 10 → ${updates['party-treasury']}`);
        console.log(`  - Party organization: 5 → ${updates['party-organization']}`);
        passed++;
      } else {
        throw new Error('Party-benefit outcome incorrect');
      }
    } catch (e) {
      console.error(`✗ FAIL: ${e.message}`);
      failed++;
    }

    // Test 6: Cautious choice increases republic support by 0.5%
    console.log('\n[TEST 6] Cautious Choice → +0.5% Republic Support');
    console.log('-'.repeat(70));
    try {
      const gameState = {
        'republic-support': 50,
        'party-credibility': 0
      };
      const updates = GoldenTwentiesIntegration.applyScenarioOutcome('cautious', gameState);
      
      if (updates['republic-support'] === 50.5 &&
          updates['party-credibility'] === 1) {
        console.log('✓ PASS');
        console.log(`  - Republic support: 50% → ${updates['republic-support']}%`);
        console.log(`  - Party credibility increased`);
        passed++;
      } else {
        throw new Error('Cautious outcome incorrect');
      }
    } catch (e) {
      console.error(`✗ FAIL: ${e.message}`);
      failed++;
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(70));
    console.log(`✓ Passed: ${passed}`);
    console.log(`✗ Failed: ${failed}`);
    console.log(`Total:   ${passed + failed}`);
    
    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! 🎉');
      console.log('\nGolden Twenties Scenario Status:');
      console.log('✓ Trigger conditions working correctly');
      console.log('✓ Consolidate path (+2% support) working');
      console.log('✓ Party-benefit path (no support change) working');
      console.log('✓ Cautious path (+0.5% support) working');
      console.log('✓ Scenario is ready for integration!');
    } else {
      console.log('\n❌ SOME TESTS FAILED');
    }
    console.log('='.repeat(70));

    return failed === 0;
  }
}

// Run tests
GoldenTwentiesTest.runAllTests();
