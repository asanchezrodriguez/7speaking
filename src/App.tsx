import { FlowShell } from './components/FlowShell';
import { useFlowStore } from './store/flowStore';
import { copy } from './content/copy-es';

// Import all screens
import { Screen0Preload } from './screens/Screen0Preload';
import { Screen0_5LanguageSelection } from './screens/Screen0_5LanguageSelection';
import { Screen1Hero } from './screens/Screen1Hero';
import { Screen2Intent } from './screens/Screen2Intent';
import { Screen3Safety } from './screens/Screen3Safety';
import { Screen4Speaking } from './screens/Screen4Speaking';
import { Screen4Typing } from './screens/Screen4Typing';
import { Screen5Processing } from './screens/Screen5Processing';
import { Screen6Insights } from './screens/Screen6Insights';
import { Screen7Reframe } from './screens/Screen7Reframe';
import { Screen8Blueprint } from './screens/Screen8Blueprint';
import { Screen9Intro7Speaking } from './screens/Screen9Intro7Speaking';
import { Screen10Conversion } from './screens/Screen10Conversion';
import { Screen11Exit } from './screens/Screen11Exit';
import { Screen13Landing7Speaking } from './screens/Screen13Landing7Speaking';

function App() {
  const { currentScreen, inputMode } = useFlowStore();

  // Map screens to JTBD progress steps
  const getProgressStep = (): { full: string; short: string } | string | undefined => {
    // Hidden on landing screen
    if (currentScreen === 13) return undefined;

    const stepMap: Record<number, { full: string; short: string } | string> = {
      1: copy.progressSteps.languageSelection,
      2: copy.progressSteps.knowingWhatYouWant,
      3: copy.progressSteps.knowingWhatYouWant,
      4: copy.progressSteps.knowingWhatYouHave,
      5: copy.progressSteps.knowingWhatYouHave,
      6: copy.progressSteps.understandingYourProfile,
      7: copy.progressSteps.understandingYourProfile,
      8: copy.progressSteps.discoveringYourPath,
      9: copy.progressSteps.buildingYourPlan,
      10: copy.progressSteps.showingTheSolution,
      11: copy.progressSteps.takingAction,
    };
    return stepMap[currentScreen];
  };

  // Determine which screen to show
  const renderScreen = () => {
    // Index mapping must be careful here
    const screens: Record<number, React.ReactNode> = {
      0: <Screen0Preload />,
      1: <Screen0_5LanguageSelection />,
      2: <Screen1Hero />,
      3: <Screen2Intent />,
      4: <Screen3Safety />,
      5: inputMode === 'voice' ? <Screen4Speaking /> : <Screen4Typing />,
      6: <Screen5Processing />,
      7: <Screen6Insights />,
      8: <Screen7Reframe />,
      9: <Screen8Blueprint />,
      10: <Screen9Intro7Speaking />,
      11: <Screen10Conversion />,
      12: <Screen11Exit />,
      13: <Screen13Landing7Speaking />,
    };

    return screens[currentScreen] || <Screen1Hero />;
  };

  // Don't show progress or back on certain screens
  const showProgress = currentScreen > 1 && currentScreen < 12 && currentScreen !== 13;
  const showBack = currentScreen > 2 && currentScreen !== 6 && currentScreen < 11 && currentScreen !== 13;

  return (
    <FlowShell
      showProgress={showProgress}
      showBack={showBack}
      progressStep={getProgressStep()}
    >
      {renderScreen()}
    </FlowShell>
  );
}

export default App;
