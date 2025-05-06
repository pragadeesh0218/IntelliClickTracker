import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

const SettingsModal = () => {
  const { 
    settings, 
    isSettingsModalOpen, 
    toggleSettingsModal, 
    updateSettings 
  } = useSettings();

  const handleSave = () => {
    toggleSettingsModal();
  };

  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={toggleSettingsModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your weather app preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Temperature Unit</h4>
          <RadioGroup 
            defaultValue={settings.tempUnit}
            onValueChange={(value) => updateSettings({ ...settings, tempUnit: value as 'celsius' | 'fahrenheit' })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="celsius" id="celsius" />
              <Label htmlFor="celsius">Celsius (°C)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fahrenheit" id="fahrenheit" />
              <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Wind Speed Unit</h4>
          <RadioGroup 
            defaultValue={settings.windUnit}
            onValueChange={(value) => updateSettings({ ...settings, windUnit: value as 'kmh' | 'mph' | 'ms' })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kmh" id="kmh" />
              <Label htmlFor="kmh">km/h</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mph" id="mph" />
              <Label htmlFor="mph">mph</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ms" id="ms" />
              <Label htmlFor="ms">m/s</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Theme</h4>
          <RadioGroup 
            defaultValue={settings.theme}
            onValueChange={(value) => updateSettings({ ...settings, theme: value as 'light' | 'dark' | 'system' })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={toggleSettingsModal}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
