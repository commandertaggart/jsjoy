#include "public.h"

//{781EF630-72B2-11d2-B852-00C04FAD5101}
DEFINE_GUID(GUID_DEVINTERFACE_VJOY, 0x781EF630, 0x72B2, 0x11d2, 0xB8, 0x52, 0x00, 0xC0, 0x4F, 0xAD, 0x51, 0x01);

DEFINE_GUID(GUID_DEVINTERFACE_HID, 0x4D1E55B2L, 0xF16F, 0x11CF, 0x88, 0xCB, 0x00,0x11, 0x11, 0x00, 0x00, 0x30);


// Prototypes
DWORD GetErrorString(TCHAR * Msg, int Size);
HANDLE OpenJoystickDevice(void);
#ifdef PPJOY_MODE
VOID Convert2CompatibleFormat(PJOYSTICK_STATE pPosCompat, PJOYSTICK_POSITION pPosNative);
#endif
BOOL LoadJoystickPos();


